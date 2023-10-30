import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { OnlyFansModule } from './only-fans/only-fans.module';
import { ScrapperModule } from './scrapper/scrapper.module';
import { MessagesModule } from './messages/messages.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as SchedulerModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    SchedulerModule,
    CoffeesModule,
    UsersModule,
    OnlyFansModule,
    ScrapperModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }), IamModule, MessagesModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
