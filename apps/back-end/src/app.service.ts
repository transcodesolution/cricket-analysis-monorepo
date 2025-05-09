import { Injectable } from '@nestjs/common';
import { responseMessage } from './helper/response-message.helper';

@Injectable()
export class AppService {
  getData() {
    return { data: {}, message: responseMessage.serverSuccessMsg };
  }
}
