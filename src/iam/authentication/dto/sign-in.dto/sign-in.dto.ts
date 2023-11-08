import { IsEmail, IsNumberString, IsOptional, MinLength } from 'class-validator';
import { TUserFeatures, TUserJsonSettings } from '../../../../users/enums/user.settings';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  email: string;
  features: TUserFeatures;
  avatar: string;
  jsonSettings: TUserJsonSettings;
}

