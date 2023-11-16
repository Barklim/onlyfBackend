import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { TUserFeatures, TUserJsonSettings } from '../../../../users/enums/user.settings';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsOptional()
  agencyName: string;
}

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
  features: TUserFeatures;
  avatar: string;
  jsonSettings: TUserJsonSettings;
}
