import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from '../../coffees/dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Response, Request } from 'express';
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
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto
  ) {
    const tokens = await this.authService.signIn(signInDto);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: true,
      // TODO: fort postman
      // secure: true,
      secure: false,
    })
    return tokens;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request
  ) {
    const refreshToken = request.cookies.refreshToken;
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: refreshToken
    }
    const refreshTokens = await this.authService.refreshTokens(refreshTokenDto);
    response.cookie('refreshToken', refreshTokens.refreshToken, {
      httpOnly: true,
      sameSite: true,
      // TODO: fort postman
      // secure: true,
      secure: false,
    })

    return refreshTokens;
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
