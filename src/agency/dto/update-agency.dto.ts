import { IsNotEmpty } from 'class-validator';
import { Plan } from '../enums/agency.enum';

export class UpdateAgencyDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  stopWords: string;
}

