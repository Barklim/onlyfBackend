import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config'
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { PolicyHandlerStorage } from './authorization/policies/policy-handlers.storage';
import {
  FrameworkContributorPolicy,
  FrameworkContributorPolicyHandler,
} from './authorization/policies/framework-contributor.policy';
import { RolesGuard } from './authorization/guards/roles/roles.guard';
import { ApiKeysService } from './authentication/api-key.service';
import { ApiKey } from '../users/api-keys/entities/api-key.entity/api-key.entity';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { OtpAuthenticationService } from './authentication/opt-authentication/opt-authentication.service';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/entities/notification.entity';
import { SUserNotifications } from '../notification/helpers/notification.suser';
import { AllNotifications } from '../notification/helpers/notification.all';
import { SendNotifications } from '../notification/helpers/notification.send';
import { AdminNotifications } from '../notification/helpers/notification.admin';
import { ManagerNotifications } from '../notification/helpers/notification.manager';
import { EmailService } from '../email/email.service';
import { TelegramService } from '../telegram/telegram.service';
import { Profile } from '../profile/entities/profile.entities';
import { Agency } from '../agency/entities/agency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey, Notification, Profile, Agency]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // PermissionsGuard, // PoliciesGuard,
    },
    AccessTokenGuard,
    ApiKeyGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    ApiKeysService,
    GoogleAuthenticationService,
    OtpAuthenticationService,
    NotificationService,
    SUserNotifications,
    AllNotifications,
    SendNotifications,
    AdminNotifications,
    ManagerNotifications,
    EmailService,
    TelegramService,
    // PolicyHandlerStorage,
    // FrameworkContributorPolicyHandler,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController]
})
export class IamModule {}
