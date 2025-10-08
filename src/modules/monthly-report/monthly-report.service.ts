import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { MonthlyReport, Mood } from '@prisma/client';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class MonthlyReportService {
    constructor(private readonly prisma: PrismaService) { }

    @Cron('0 0 1 * *')
    async generateAllMonthlyReports() {
        console.log('Gerando relatórios mensais...');

        const users = await this.prisma.user.findMany({
            where: { deletedAt: null },
        });

        for (const user of users) {
            await this.generateMonthlyReport(user.id);
        }

        console.log('Relatórios mensais gerados com sucesso!');
    }

    async generateMonthlyReport(userId: number) {
        const now = new Date();
        const lastMonth = subMonths(now, 1);
        const monthStart = startOfMonth(lastMonth);
        const monthEnd = endOfMonth(lastMonth);

        const weeklyReports = await this.prisma.weeklyReport.findMany({
            where: {
                userId,
                startDate: { gte: monthStart, lte: monthEnd },
            },
        });

        if (weeklyReports.length === 0) return null;

        const moods = weeklyReports.map(r => r.averageMood).filter((m): m is Mood => m !== null);
        const averageMood = this.calculateAverageMood(moods);

        const moodDistribution = this.mergeMoodDistributions(
            weeklyReports.map(r => r.moodDistribution)
        );

        const totalNotes = weeklyReports.reduce((sum, w) => sum + w.notesCount, 0);
        const activeDays = weeklyReports.reduce((sum, w) => sum + w.daysActive, 0);
        const completedGoals = weeklyReports.reduce((sum, w) => sum + w.completedGoals, 0);
        const pendingGoals = weeklyReports.reduce((sum, w) => sum + w.pendingGoals, 0);

        const successRate =
            completedGoals + pendingGoals > 0
                ? Math.round((completedGoals / (completedGoals + pendingGoals)) * 100)
                : 0;

        const bestWeek = weeklyReports.reduce((a, b) =>
            this.moodValue(a.averageMood ?? Mood.NEUTRAL) >
                this.moodValue(b.averageMood ?? Mood.NEUTRAL)
                ? a
                : b
        ).startDate;

        const worstWeek = weeklyReports.reduce((a, b) =>
            this.moodValue(a.averageMood ?? Mood.NEUTRAL) <
                this.moodValue(b.averageMood ?? Mood.NEUTRAL)
                ? a
                : b
        ).startDate;

        const volatility = this.calculateVolatility(weeklyReports.map(r => r.averageMood ?? Mood.NEUTRAL));

        const lastMonthStart = startOfMonth(subMonths(now, 2));
        const lastMonthReport = await this.prisma.monthlyReport.findFirst({
            where: { userId, month: lastMonthStart },
        });

        const progress = lastMonthReport
            ? {
                mood:
                    this.moodValue(averageMood) - this.moodValue(lastMonthReport.averageMood),
                notes: totalNotes - lastMonthReport.totalNotes,
            }
            : null;

        const alert = volatility > 1.5 || this.moodValue(averageMood) <= 2;
        const recommendation = this.buildRecommendation(averageMood, alert);

        const existingReport = await this.prisma.monthlyReport.findFirst({
            where: { userId, month: monthStart },
        });

        if (existingReport) {
            return this.prisma.monthlyReport.update({
                where: { id: existingReport.id },
                data: {
                    averageMood,
                    moodDistribution,
                    moodVolatility: volatility,
                    bestWeek,
                    worstWeek,
                    totalNotes,
                    activeDays,
                    completedGoals,
                    pendingGoals,
                    successRate,
                    progressComparedToLastMonth: progress ?? {},
                    alert,
                    recommendation,
                },
            });
        } else {
            return this.prisma.monthlyReport.create({
                data: {
                    userId,
                    month: monthStart,
                    averageMood,
                    moodDistribution,
                    moodVolatility: volatility,
                    bestWeek,
                    worstWeek,
                    totalNotes,
                    activeDays,
                    completedGoals,
                    pendingGoals,
                    successRate,
                    progressComparedToLastMonth: progress ?? {},
                    alert,
                    recommendation,
                },
            });
        }
    }

    private moodValue(mood: Mood): number {
        const map: Record<Mood, number> = {
            VERY_SAD: 1,
            SAD: 2,
            NEUTRAL: 3,
            HAPPY: 4,
            VERY_HAPPY: 5,
        };
        return map[mood];
    }

    private calculateAverageMood(moods: Mood[]): Mood {
        const avg = moods.reduce((a, m) => a + this.moodValue(m), 0) / moods.length;
        if (avg < 1.5) return Mood.VERY_SAD;
        if (avg < 2.5) return Mood.SAD;
        if (avg < 3.5) return Mood.NEUTRAL;
        if (avg < 4.5) return Mood.HAPPY;
        return Mood.VERY_HAPPY;
    }

    private mergeMoodDistributions(dists: any[]) {
        const merged = { VERY_SAD: 0, SAD: 0, NEUTRAL: 0, HAPPY: 0, VERY_HAPPY: 0 };
        for (const d of dists) {
            for (const k in d) merged[k] += d[k];
        }
        const total = Object.values(merged).reduce((a, b) => a + b, 0);
        for (const k in merged) merged[k] = Number(((merged[k] / total) * 100).toFixed(1));
        return merged;
    }

    private calculateVolatility(moods: Mood[]): number {
        const values = moods.map(m => this.moodValue(m));
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance =
            values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        return Math.sqrt(variance).toFixed(2) as unknown as number;
    }

    private buildRecommendation(mood: Mood, alert: boolean): string {
        if (alert)
            return 'Seu humor variou bastante este mês. Pode ser um bom momento para conversar com um profissional. 💬';
        switch (mood) {
            case Mood.HAPPY:
            case Mood.VERY_HAPPY:
                return 'Você teve um ótimo mês! Continue mantendo seus hábitos positivos. 🌟';
            case Mood.NEUTRAL:
                return 'Um mês estável, talvez seja hora de buscar novas metas. ⚖️';
            case Mood.SAD:
            case Mood.VERY_SAD:
                return 'Seu humor esteve mais baixo. Tente anotar o que tem te deixado assim. ❤️';
        }
    }

    async getReports(userId: number): Promise<MonthlyReport[]> {
        return this.prisma.monthlyReport.findMany({
            where: { userId },
            orderBy: { month: 'desc' },
        });
    }

    async getLatestReport(userId: number): Promise<MonthlyReport | null> {
        return this.prisma.monthlyReport.findFirst({
            where: { userId },
            orderBy: { month: 'desc' },
        });
    }
}
