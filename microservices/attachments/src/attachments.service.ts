import { Injectable } from '@nestjs/common';

@Injectable()
export class AttachmentsService {
  getHello(): string {
    return 'Hello World!';
  }
}
