import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotificationForUser(@Req() request: Request) {
    const tokenParts = request.headers.authorization.split(' ');
    const token = tokenParts[1]
    const refreshTokenData = jwt.decode(token);

    return this.notificationService.getNotificationForUser(refreshTokenData.sub as unknown as string);
  }

  @Get('count')
  getNotificationCountForUser(@Req() request: Request) {
    const tokenParts = request.headers.authorization.split(' ');
    const token = tokenParts[1]
    const refreshTokenData = jwt.decode(token);

    return this.notificationService.getNotificationCountForUser(refreshTokenData.sub as unknown as string);
  }

  @Delete(':notificationId')
  markAsDelete(
    @Param('notificationId') notificationId: string,
    @Req() request: Request)
  {
    const tokenParts = request.headers.authorization.split(' ');
    const token = tokenParts[1]
    const refreshTokenData = jwt.decode(token);

    return this.notificationService.markAsDelete(notificationId, refreshTokenData.sub as unknown as string);
  }
}
