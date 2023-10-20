import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @IsNotEmpty()
  token: string;
}