import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from '../../coffees/dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Response } from 'express';
import { OtpAuthenticationService } from './opt-authentication/opt-authentication.service';
import { toFileStream } from 'qrcode';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService
  ) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  // cookies realization
  // async signIn(
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() signInDto: SignInDto
  // ) {
  //   const accessToken = await this.authService.signIn(signInDto);
  //   response.cookie('accessToken', accessToken, {
  //     httpOnly: true,
  //     sameSite: true,
  //     // TODO: fort postman
  //     // secure: true,
  //     secure: false,
  //   })
  // }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto)
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
    response.type( 'png');
    return toFileStream(response, uri);
  }
}
