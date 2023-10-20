import { PermissionsGuard } from './permissions.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    expect(new PermissionsGuard()).toBeDefined();
  });
});
