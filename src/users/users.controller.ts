import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Request } from 'express';
import { UpdateNotificationsRequestData } from '../notification/dto/update-notifications.dto';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('_expand') _expand: string,
    @Query('_limit') _limit: string,
    @Query('_page') _page: string,
    @Query('_sort') _sort: string,
    @Query('_order') _order: string,
    @Query('q') q: string,
    @Query('roles') roles: string,
  ) {
    const params = { _expand, _limit, _page, _sort, _order, q, roles }

    return this.usersService.findAll(params);
  }

  @Get('me')
  findMe(@Req() request: Request) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.usersService.findMe(tokenParts[1]);
  }

  @Post('settings/notifications')
  setNotificationsSettings(@Req() request: Request, @Body() settingsData: UpdateNotificationsRequestData) {
    const tokenParts = request.headers.authorization.split(' ');

    return this.usersService.setNotificationsSettings(tokenParts[1], settingsData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
