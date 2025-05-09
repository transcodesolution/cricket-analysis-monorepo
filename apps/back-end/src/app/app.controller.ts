import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { constants } from "@cricket-analysis-monorepo/constants";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getData() {
    constants()
    return this.appService.getData();
  }
}
