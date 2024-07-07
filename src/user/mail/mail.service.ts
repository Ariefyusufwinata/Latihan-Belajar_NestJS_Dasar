import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  sendMail() {
    console.info('Send Mail');
  }
}

export const mailService = new MailService();
