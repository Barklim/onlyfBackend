import { CoffeesPermission } from '../../coffees/coffees.permission';

export const Permission = {
  ...CoffeesPermission,
}

export type PermissionType = CoffeesPermission; // | ...other permission enums