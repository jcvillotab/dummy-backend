import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/common/utils/custom_logger';

@Injectable()
export class MailService {
    logger: CustomLogger;
    constructor(private mailerService: MailerService) {
        this.logger = new CustomLogger(MailService.name);
    }

    async sendMail(to: string, subject: string, text: string) {
        this.logger.debug(`event=sendMail to=${to} outcome=success type=audit`);
        await this.mailerService.sendMail({
            to,
            subject,
            text,
        });
    }   
}
