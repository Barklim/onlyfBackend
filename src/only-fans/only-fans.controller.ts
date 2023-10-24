import { Controller, Get, Param, Query } from '@nestjs/common';
import { OnlyFansService } from './only-fans.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';

// TODO:
// @Auth(AuthType.Bearer, AuthType.ApiKey)
@Auth(AuthType.None)
@Controller('only-fans')
export class OnlyFansController {
  constructor(private readonly onlyFansService: OnlyFansService) {}

  @Get()
  scrapperController() {
    return 'onlyFans controller working';
  }

  @Get('test')
  getTest() {
    return this.onlyFansService.getDataViaPuppeteer();
  }

  @Get('products')
  getProducts(@Query('product') product: string) {
    return this.onlyFansService.getProducts(product);
  }

  // TODO:
  // @Roles(Role.Admin)
  @Get(':id/run')
  runScrapper(@Param('id') id: string) {
    return this.onlyFansService.runScrapper(id);
  }

  @Get(':id/stop')
  stopScrapper(@Param('id') id: string) {
    return this.onlyFansService.stopScrapper(id);
  }

  @Get('/stop_all')
  stopAllScrappers() {
    return this.onlyFansService.stopAllScrappers();
  }
}
