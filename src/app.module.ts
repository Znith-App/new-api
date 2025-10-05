import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailService } from './modules/mail/mail.service';
import { QuotesService } from './modules/quotes/quotes.service';
import { QuotesController } from './modules/quotes/quotes.controller';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [AppController, QuotesController],
  providers: [AppService, MailService, QuotesService],
})
export class AppModule {}
