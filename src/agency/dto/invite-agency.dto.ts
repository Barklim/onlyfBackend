import { IsNotEmpty } from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class InviteAgencyDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  role: Role;
}

