import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class StreakService {
    constructor(private readonly prisma: PrismaService) {}

    async createStreak(userId: number) {
        return this.prisma.streak.create({
            data: {
                userId,
                currentStreak: 0,
                longestStreak: 0,
                lastActive: null,
            },
        });
    }

    async getStreakByUserId(userId: number) {
        return this.prisma.streak.findUnique({
            where: { userId },
        });
    }

    async updateStreak(userId: number) {
        let streak = await this.getStreakByUserId(userId);
        if (!streak) {
            streak = await this.createStreak(userId);
        }

        const today = startOfDay(new Date());
        const lastActive = streak.lastActive ? startOfDay(new Date(streak.lastActive)) : null;

        let newCurrentStreak = streak.currentStreak;
        let newLongestStreak = streak.longestStreak;

        if (!lastActive) {
            newCurrentStreak = 1;
        } else {
            const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / 86400000);

            if (diffDays === 0) {
                return streak;
            } else if (diffDays === 1) {
                newCurrentStreak += 1;
            } else {
                newCurrentStreak = 0;
            }
        }

        if (newCurrentStreak > newLongestStreak) {
            newLongestStreak = newCurrentStreak;
        }

        return this.prisma.streak.update({
            where: { userId },
            data: {
                currentStreak: newCurrentStreak,
                longestStreak: newLongestStreak,
                lastActive: today,
            },
        });
    }

    async resetStreak(userId: number) {
        return this.prisma.streak.update({
            where: { userId },
            data: { currentStreak: 0 },
        });
    }

    @Cron('0 0 * * *')
    async resetInactiveStreaks() {
        const today = startOfDay(new Date());
        const yesterday = subDays(today, 1);

        await this.prisma.streak.updateMany({
            where: {
                lastActive: { lt: yesterday },
                currentStreak: { gt: 0 },
            },
            data: { currentStreak: 0 },
        });

        console.log('✅ Streaks inativas foram resetadas.');
    }
}