import { IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty()
  msg_created_at: string;

  @IsNotEmpty()
  msgId: string;

  @IsNotEmpty()
  chatId: string;

  @IsNotEmpty()
  fromUserId: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  isRead: boolean;
}

