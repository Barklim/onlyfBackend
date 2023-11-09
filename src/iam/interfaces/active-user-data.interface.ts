import { Role } from '../../users/enums/role.enum';
import { PermissionType } from '../authorization/permission.type';

export interface ActiveUserData {
  /**
   *	The "subject" of the token. The value of this property it the user ID
   *	that granted this token.
   */
  sub: string;

  /**
   *	The subject's (user) email.
   */
  email: string;

  /**
   * The subject's (user) role.
   */
  role: Role;

  /**
  * The subject's (user) permissions.
  * NOTE: Using this approach in combination with the "role-based" approach
  * does not make sense. We have those two properties here ("role" and "permissions")
  * just to showcase two alternative approaches.
  */
  permissions: PermissionType[];
}