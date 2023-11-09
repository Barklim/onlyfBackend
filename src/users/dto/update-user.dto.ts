import { IsOptional } from 'class-validator';
import { TUserFeatures, TUserTheme } from '../enums/user.settings';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {
  @IsOptional()
  isAccountsPageWasOpened?: boolean;

  @IsOptional()
  isArticlesPageWasOpened?: boolean;

  @IsOptional()
  theme?: TUserTheme;

  @IsOptional()
  features?: TUserFeatures;
}
