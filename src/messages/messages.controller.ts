import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { CreateMessageDto } from './dto/create-message.dto';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Request } from 'express';

// TODO: authType
@Auth(AuthType.None)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get()
  messageController() {
    return 'message controller working';
  }

  @Post(':id')
  create(@Param('id') id: string, @Body() createMessageDto: Array<CreateMessageDto>) {
    return this.messageService.createMany(id, createMessageDto);
  }

  @Post(':id/one')
  createOne(@Param('id') id: string, @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createOne(id, createMessageDto);
  }

  // TODO:
  // Get cookies here, and find user next check role
  // @Roles(Role.Admin)
  @Get('all/:id')
  findAll(@Param('id') id: string) {
    return this.messageService.findAll(id);
  }

  @Get('all/')
  findAllBy(@Query('managerId') managerId: string) {
    return this.messageService.findAllBy(managerId);
  }

  @Get('activeDialog/:id')
  findActiveDialogs(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    // FromModel constraint
    @Query('mc') mc: string,
    // FromUser constraint
    @Query('uc') uc: string,
  ) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return this.messageService.findActiveDialog(id, parsedStartDate, parsedEndDate, Number(mc), Number(uc));
  }

  @Get('activeDialogs/:id')
  findActiveDialogs1(
    @Param('id') id: string,
    @Query('mc') mc: string,
    @Query('uc') uc: string,
    @Query('tz') tz: string,
  ) {
    return this.messageService.findActiveDialogs(id, Number(mc), Number(uc), Number(tz));
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateMessageDto: Array<UpdateMessageDto>
  ) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.messageService.update(tokenParts[1], id, updateMessageDto);
  }
}
