import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailService } from './modules/mail/mail.service';
import { QuotesService } from './modules/quotes/quotes.service';
import { QuotesController } from './modules/quotes/quotes.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthGuard } from './common/guards/auth.guard';
import { NotesService } from './modules/notes/notes.service';
import { NotesController } from './modules/notes/notes.controller';
import { GoalsService } from './modules/goals/goals.service';
import { GoalsController } from './modules/goals/goals.controller';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ScheduleModule.forRoot()],
  controllers: [AppController, QuotesController, NotesController, GoalsController],
  providers: [
    AppService, 
    MailService, 
    QuotesService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    NotesService,
    GoalsService
  ],
})
export class AppModule {}
