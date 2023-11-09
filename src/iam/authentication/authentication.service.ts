import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto, SignInResponse } from './dto/sign-in.dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config'
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from '../../coffees/dto/refresh-token.dto';
import { randomUUID } from 'crypto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage/refresh-token-ids.storage';
import { OtpAuthenticationService } from './opt-authentication/opt-authentication.service';
import { NotificationService } from '../../notification/notification.service';
import { Profile } from '../../profile/entities/profile.entities';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly otpAuthService: OtpAuthenticationService,
    private notificationService: NotificationService,
  ){}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);

      const profile = new Profile();
      profile.userId = 'temporaryUserId'
      const profileSaved = await this.profilesRepository.save(profile);
      user.profileId = profileSaved.id;
      let savedUser = await this.usersRepository.save(user);

      profileSaved.userId = savedUser.id;
      await this.profilesRepository.save(profileSaved);

      const tokens = await this.generateTokens(savedUser);

      const signUpResponse: SignUpResponse = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        id: savedUser.id,
        email: savedUser.email,
        features: savedUser.features,
        avatar: savedUser.avatar,
        jsonSettings: savedUser.jsonSettings,
      };

      await this.notificationService.OnSignUp(savedUser.id);

      return signUpResponse;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    })
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    if (user.isTfaEnabled) {
      const isValid = this.otpAuthService.verifyCode(
        signInDto.tfaCode,
        user.tfaSecret
      )
      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    const tokens = await this.generateTokens(user);

    const signInResponse: SignInResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      id: user.id,
      email: user.email,
      features: user.features,
      avatar: user.avatar,
      jsonSettings: user.jsonSettings,
    };

    return signInResponse;
  }

  async generateTokens(user: User, remainingTime?: number) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role },
        // {
        //   email: user.email,
        //   role: user.role,
        //   // Warning
        //   permissions: user.permissions,
        // },
      ),
      this.signToken(user.id, remainingTime ? remainingTime : this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string}
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      const refreshTokenData = jwt.decode(refreshTokenDto.refreshToken) as { exp: number };
      const remainingTime = refreshTokenData.exp - Math.floor(Date.now() / 1000);

      return this.generateTokens(user, remainingTime);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        // Take action: notify user that his refresh token might have been stolen?
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
    return accessToken;
  }
}
