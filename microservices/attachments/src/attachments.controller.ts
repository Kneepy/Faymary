import { Controller, Get } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';

@Controller()
export class AttachmentsController {
  constructor(private readonly appService: AttachmentsService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
