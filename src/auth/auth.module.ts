import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenStrategy } from './strategies/auth_token.strategy';

@Module({ 
    imports:[JwtModule.register({}), UserModule, MailModule],
    controllers: [AuthController], 
    providers: [AuthService, AuthTokenStrategy] 
})
export class AuthModule {}
