import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { Mood, Status, WeeklyReport } from '@prisma/client';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ScheduleModule } from '@nestjs/schedule';

@Injectable()
export class WeeklyReportService {
  constructor(private readonly prisma: PrismaService) { }

  @Cron('0 0 * * 0') // every Sunday at midnight
  async generateAllWeeklyReports() {
    console.log('Generating weekly report...');

    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
    });

    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.all(batch.map(user =>
        this.generateWeeklyReport(user.id).catch(err => {
          console.error(`Failed for user ${user.id}:`, err);
        })
      ));
    }

    console.log('Successfully generated weekly reports for all users.');
  }

  async generateWeeklyReport(userId: number) {
    const now = new Date();
    const startDate = startOfWeek(now, { weekStartsOn: 1 }); // monday as start of week
    const endDate = endOfWeek(now, { weekStartsOn: 1 });

    const notes = await this.prisma.note.findMany({
      where: {
        userId,
        createdAt: { gte: startDate, lte: endDate },
        deletedAt: null,
      },
    });

    const goals = await this.prisma.goal.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    const moodDistribution = this.calculateMoodDistribution(notes);
    const averageMood = this.calculateAverageMood(moodDistribution);

    const daysActive = new Set(notes.map((n) => n.createdAt.toDateString())).size;

    const completedGoals = goals.filter((g) => g.status === Status.COMPLETED).length;
    const pendingGoals = goals.filter((g) => g.status === Status.PENDING).length;

    const mostActiveHour = this.findMostActiveHour(notes);

    const alert = this.hasSadStreak(notes);

    const moodTrend = await this.calculateMoodTrend(userId, averageMood);

    const existingReport = await this.prisma.weeklyReport.findFirst({
      where: {
        userId,
        startDate,
      },
    });

    let report;

    if (existingReport) {
      report = await this.prisma.weeklyReport.update({
        where: { id: existingReport.id },
        data: {
          endDate,
          averageMood,
          moodDistribution,
          notesCount: notes.length,
          completedGoals,
          pendingGoals,
          moodTrend,
          mostActiveHour,
          daysActive,
          alert,
        },
      });
    } else {
      report = await this.prisma.weeklyReport.create({
        data: {
          userId,
          startDate,
          endDate,
          averageMood,
          moodDistribution,
          notesCount: notes.length,
          completedGoals,
          pendingGoals,
          moodTrend,
          mostActiveHour,
          daysActive,
          alert,
        },
      });
    }

    return report;
  }

  private calculateMoodDistribution(notes: any[]) {
    const distribution: Record<Mood, number> = {
      VERY_SAD: 0,
      SAD: 0,
      NEUTRAL: 0,
      HAPPY: 0,
      VERY_HAPPY: 0,
    };

    notes.forEach((n) => (distribution[n.mood] += 1));
    const total = notes.length || 1;

    for (const key in distribution) {
      distribution[key as Mood] = Number(((distribution[key as Mood] / total) * 100).toFixed(1));
    }

    return distribution;
  }

  private calculateAverageMood(dist: Record<Mood, number>): Mood {
    const weights: Record<Mood, number> = {
      VERY_SAD: 1,
      SAD: 2,
      NEUTRAL: 3,
      HAPPY: 4,
      VERY_HAPPY: 5,
    };

    let totalWeight = 0;
    let totalCount = 0;

    for (const mood of Object.keys(dist) as Mood[]) {
      totalWeight += weights[mood] * (dist[mood] / 100);
      totalCount += dist[mood] / 100;
    }

    const avg = totalWeight / (totalCount || 1);
    if (avg < 1.5) return Mood.VERY_SAD;
    if (avg < 2.5) return Mood.SAD;
    if (avg < 3.5) return Mood.NEUTRAL;
    if (avg < 4.5) return Mood.HAPPY;
    return Mood.VERY_HAPPY;
  }

  private findMostActiveHour(notes: any[]) {
    if (!notes.length) return null;

    const hours = new Array(24).fill(0);
    notes.forEach((n) => hours[n.createdAt.getHours()]++);

    const max = Math.max(...hours);
    return hours.indexOf(max);
  }

  private hasSadStreak(notes: any[]) {
    const sorted = notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    let streak = 0;

    for (const note of sorted) {
      if (note.mood === Mood.VERY_SAD || note.mood === Mood.SAD) streak++;
      else streak = 0;

      if (streak >= 3) return true;
    }
    return false;
  }

  private async calculateMoodTrend(userId: number, currentMood: Mood) {
    const lastReport = await this.prisma.weeklyReport.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
      skip: 1,
    });

    if (!lastReport?.averageMood) return 0;

    const moodValues: Record<Mood, number> = {
      VERY_SAD: 1,
      SAD: 2,
      NEUTRAL: 3,
      HAPPY: 4,
      VERY_HAPPY: 5,
    };

    const diff = moodValues[currentMood] - moodValues[lastReport.averageMood];
    if (diff > 0) return 1;
    if (diff < 0) return -1;
    return 0;
  }

  async getReports(userId: number, startDate?: Date, endDate?: Date): Promise<WeeklyReport[]> {
    const where: any = { userId };

    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = startDate;
      if (endDate) where.startDate.lte = endDate;
    }

    return this.prisma.weeklyReport.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });
  }

  async getLatestReport(userId: number): Promise<WeeklyReport | null> {
    return this.prisma.weeklyReport.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }
}