import { Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { SendVerifyCodeDto } from './dto/send-verify-code.dto';

const transport = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT!, 10),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

@Injectable()
export class MailerService {
  async createVerifyCode(
    sendVerifyCodeDto: SendVerifyCodeDto,
  ): Promise<SentMessageInfo> {
    const message = {
      to: sendVerifyCodeDto.identifier,
      from: process.env.EMAIL_FROM,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${sendVerifyCodeDto.code}`,
      html: `<p>Your verification code is: <strong>${sendVerifyCodeDto.code}</strong></p>`,
    };

    return await transport.sendMail(message);
  }
}
