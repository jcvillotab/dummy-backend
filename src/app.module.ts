import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthTokenGuard } from './common/guards/auth_token.guard';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { PetModule } from './pet/pet.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, MailModule, PetModule],
  controllers: [],
  providers: [
    {
        provide: APP_GUARD,
        useClass: AuthTokenGuard
    }
  ],
})
export class AppModule {}
