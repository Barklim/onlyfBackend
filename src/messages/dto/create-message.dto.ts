import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
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
}

