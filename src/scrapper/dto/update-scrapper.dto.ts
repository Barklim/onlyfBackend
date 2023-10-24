import { IsNotEmpty } from 'class-validator';

export class UpdateScrapperDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  ofId: string;
}

