import { IsNotEmpty } from 'class-validator';
import { Plan } from '../enums/agency.enum';

export class CreateAgencyDto {
  @IsNotEmpty()
  name: string;
}

