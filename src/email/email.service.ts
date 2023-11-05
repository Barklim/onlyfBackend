import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { User } from '../users/entities/user.entity';
import { NotificationType } from '../notification/enums/notification.enum';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendMail() {
    await this.setTransport();
    const link = 'https://example.com/';
    return this.mailerService
      .sendMail({
        transporterName: 'gmail',
        // to: 'klim.barkalov@mail.ru', // list of receivers
        to: 'kliment.barkalov@gmail.com', // list of receivers
        from: 'noreply@nestjs.com',
        subject: 'Subject', // Subject line
        // template: 'action',
        // context: {
        //   // Data to be sent to template engine..
        //   code: '38320',
        // },
        // text: 'Welcome text',
        html:
          `
            <div>
              <h1>Для активации перейдите по ссылке</h1>
              <a href='${link}'>${link}</a>
            </div>
          `
      })
      .then((success) => {
        console.log(success);
        return success
      })
      .catch((err) => {
        console.log(err);
        return err
      });
  }

  public async sendNotificationMail(
    user: User,
    subject: string,
    text: string,
    eventData: any = undefined,
    type: NotificationType = NotificationType.COMMON
  ) {
    const { settings: { notifications: notificationSettings } } = user;

    let allowSend = true;
    if (notificationSettings && notificationSettings.email) {
      switch (type) {
        case NotificationType.COMMON:
          allowSend = (notificationSettings.email.info !== undefined) ? !!notificationSettings.email.info : true;
          break;
        case NotificationType.EVENTS:
          allowSend = (notificationSettings.email.events !== undefined) ? !!notificationSettings.email.events : true;
          break;
        case NotificationType.CHAT:
          allowSend = (notificationSettings.email.comments !== undefined) ? !!notificationSettings.email.comments : true;
          break;
      }
    }

    if (allowSend && process.env.ALLOW_SEND === 'true') {

      // Todo: templating
      // const template = this.getTemplate(eventData);
      await this.setTransport();
      const email = [user.email]
      return this.mailerService
        .sendMail({
          transporterName: 'gmail',
          to: email,
          from: 'noreply@nestjs.com',
          subject: subject,
          html:
            `
            <div>
              ${text}
            </div>
          `
        })
        .then((success) => {
          console.log(success);
          return success
        })
        .catch((err) => {
          console.log(err);
          return err
        });
    }
  }
}
