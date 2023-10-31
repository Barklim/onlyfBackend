import { IsNotEmpty } from 'class-validator';

export class CreateAgencyDto {
  @IsNotEmpty()
  name: string;
}

