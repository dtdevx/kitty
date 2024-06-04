import { Controller, Get } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Kitty')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
