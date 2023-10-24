import { IsNotEmpty } from 'class-validator';

export class CreateScrapperDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  ofId: string;
}

