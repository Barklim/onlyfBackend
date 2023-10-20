import { IsEmail, IsNumber, IsNumberString, IsOptional, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}
