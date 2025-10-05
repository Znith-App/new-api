import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailService } from './modules/mail/mail.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
