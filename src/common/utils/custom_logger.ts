import {Logger} from '@nestjs/common'

export class CustomLogger extends Logger {
    fs = require('fs');
    moment = require('moment');

    #write(message: string, context?: string): void {
        console.log(context);
        var time = this.moment().format('YYYY-MM-DD, HH:mm:ss').toString();
        
        var writter = this.fs.createWriteStream('./app_logs.log', {flags: 'a'});
        writter.write(`${time} - ${message}\n`);
        writter.end();
    }

    log(message: string, context?: string): void {
        this.#write(message, context)
        super.log(message, context)
    }

    error(message: string, trace?: string, context?: string): void {
        this.#write(message, context)
        super.error(message, trace, context)
    }

    warn(message: string, context?: string): void {
        this.#write(message, context)
        super.warn(message, context)
    }

    debug(message: string, context?: string): void {
        this.#write(message, context)
        super.debug(message, context)
    }
}