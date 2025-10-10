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
import { ColorsController } from './modules/colors/colors.controller';
import { ColorsService } from './modules/colors/colors.service';
import { WeeklyReportService } from './modules/weekly-report/weekly-report.service';
import { WeeklyReportController } from './modules/weekly-report/weekly-report.controller';
import { MonthlyReportService } from './modules/monthly-report/monthly-report.service';
import { MonthlyReportController } from './modules/monthly-report/monthly-report.controller';
import { StreakController } from './modules/streak/streak.controller';
import { StreakService } from './modules/streak/streak.service';
import { PsychotherapyController } from './modules/psychotherapy/psychotherapy.controller';
import { PsychotherapyService } from './modules/psychotherapy/psychotherapy.service';
import { TherapySessionService } from './modules/therapy-session/therapy-session.service';
import { TherapySessionController } from './modules/therapy-session/therapy-session.controller';
import { SessionNoteService } from './modules/session-note/session-note.service';
import { SessionNoteController } from './modules/session-note/session-note.controller';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ScheduleModule.forRoot()],
  controllers: [AppController, QuotesController, NotesController, GoalsController, ColorsController, WeeklyReportController, MonthlyReportController, StreakController, PsychotherapyController, TherapySessionController, SessionNoteController],
  providers: [
    AppService, 
    MailService, 
    QuotesService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    NotesService,
    GoalsService,
    ColorsService,
    WeeklyReportService,
    MonthlyReportService,
    StreakService,
    PsychotherapyService,
    TherapySessionService,
    SessionNoteService
  ],
})
export class AppModule {}
