import { IsEmail, MinLength } from 'class-validator';
import { TUserFeatures, TUserJsonSettings } from '../../../../users/enums/user.settings';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

}

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  email: string;
  features: TUserFeatures;
  avatar: string;
  jsonSettings: TUserJsonSettings;
}
