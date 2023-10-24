import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { ScrapperService } from './scrapper.service';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';

// TODO: authtype
@Auth(AuthType.None)
@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get()
  scrapperController() {
    return 'scrapper controller working';
  }

  @Get('test')
  getScrappers() {
    return this.scrapperService.getScrappers();
  }

  @Post()
  create(@Body() createScrapperDto: CreateScrapperDto) {
    return this.scrapperService.create(createScrapperDto);
  }

  // TODO:
  // Get cookies here, and find user next check role
  // @Roles(Role.Admin)
  @Get('all')
  findAll() {
    return this.scrapperService.findAllScrappers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scrapperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScrapperDto: UpdateScrapperDto) {
    return this.scrapperService.update(+id, updateScrapperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scrapperService.remove(+id);
  }
}
