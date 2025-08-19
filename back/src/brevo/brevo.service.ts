import { Injectable, Logger } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo'
import { ConfigService } from '@nestjs/config';

const SENDER={
  email:'medo.mrt.42@gmail.com',
  name: "Latch"
}

@Injectable()
export class BrevoService {
  private readonly emailApi: Brevo.TransactionalEmailsApi;
  private readonly logger = new Logger(BrevoService.name);

  constructor(private readonly configService: ConfigService) {
    this.emailApi = new Brevo.TransactionalEmailsApi();
    this.emailApi.setApiKey(0, configService.get<string>('BREVO_API_KEY')!)
  }

  async sendTransactionalEmail(
    to: {email: string}[],
    subject: string,
    htmlContent: string,
  ) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.sender = SENDER;
    sendSmtpEmail.to = to;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    try {
      const data = await this.emailApi.sendTransacEmail(sendSmtpEmail);
      this.logger.log('Email sent sucessfully');
      return data;
    } catch (e) {
      this.logger.error(`Error sending email: ${e.message}`);
      throw new Error(`Failed to send transactional email`);
    }
  }
}
