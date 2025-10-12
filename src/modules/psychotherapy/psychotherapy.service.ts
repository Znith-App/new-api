import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePsychotherapyDto } from './dto/create-psychotherapy.dto';
import { UpdatePsychotherapyDto } from './dto/update-psychotherapy.dto';
import { addDays, setHours, setMinutes, setSeconds } from 'date-fns';
import { TherapySessionService } from '../therapy-session/therapy-session.service';

@Injectable()
export class PsychotherapyService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly therapySessionService: TherapySessionService,
    ) { }

    async create(createDto: CreatePsychotherapyDto) {
        const psychotherapy = await this.prisma.psychotherapy.create({
            data: createDto,
            include: {
                user: true,
                psychologist: true,
                therapySessions: true,
            },
        });

        const today = new Date();
        const targetDay = this.getDayNumber(createDto.dayOfWeek);
        const currentDay = today.getDay();
        let daysUntilNext = (targetDay - currentDay + 7) % 7;
        if (daysUntilNext === 0) daysUntilNext = 7;

        const nextSessionDate = addDays(today, daysUntilNext);

        const [hours, minutes] = (createDto.time ?? '09:00').split(':').map(Number);
        const sessionDate = setHours(setMinutes(setSeconds(nextSessionDate, 0), minutes), hours);

        await this.therapySessionService.create({
            psychotherapyId: psychotherapy.id,
            sessionDate: sessionDate.toISOString(),
        });

        return psychotherapy;
    }

    private getDayNumber(dayOfWeek: string): number {
        const map: Record<string, number> = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };
        return map[dayOfWeek];
    }

    async findAllByPsychologist(psychologistId: number) {
        return this.prisma.psychotherapy.findMany({
            where: { psychologistId },
            include: {
                user: true,
                therapySessions: true,
            },
        });
    }

    async findAllByUser(userId: number) {
        return this.prisma.psychotherapy.findMany({
            where: { userId },
            include: {
                psychologist: true,
                therapySessions: true,
            },
        });
    }

    async findOne(id: number) {
        const psychotherapy = await this.prisma.psychotherapy.findUnique({
            where: { id },
            include: {
                user: true,
                psychologist: true,
                therapySessions: true,
            },
        });
        if (!psychotherapy) throw new NotFoundException('Psychotherapy not found');
        return psychotherapy;
    }

    async update(id: number, updateDto: UpdatePsychotherapyDto) {
        return this.prisma.psychotherapy.update({
            where: { id },
            data: updateDto,
        });
    }

    async remove(id: number) {
        const psychotherapy = await this.prisma.psychotherapy.findUnique({
            where: { id },
        });

        if (!psychotherapy) {
            throw new NotFoundException('Psychotherapy not found');
        }

        return this.prisma.psychotherapy.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async getCalendarByPsychologist(
        psychologistId: number,
        month: number,
        year: number,
    ) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const psychotherapies = await this.prisma.psychotherapy.findMany({
            where: {
                psychologistId,
                deletedAt: null,
            },
            include: {
                user: { select: { id: true, name: true } },
                therapySessions: true,
            },
        });

        const weekDaysMap: Record<string, number> = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };

        const getDatesForWeekday = (weekday: number) => {
            const days: Date[] = [];
            const d = new Date(year, month - 1, 1);

            while (d.getMonth() === month - 1) {
                if (d.getDay() === weekday) days.push(new Date(d));
                d.setDate(d.getDate() + 1);
            }
            return days;
        };

        const allSessions: {
            psychotherapyId: number;
            user: { id: number; name: string };
            time: string;
            attended?: boolean;
            date: string;
            simulated: boolean;
        }[] = [];

        for (const psychotherapy of psychotherapies) {
            const { id: psychotherapyId, user, dayOfWeek, time, therapySessions } = psychotherapy;

            if (!dayOfWeek || !time) continue;

            const weekdayNumber = weekDaysMap[dayOfWeek];
            if (weekdayNumber === undefined) continue;

            const matchingDates = getDatesForWeekday(weekdayNumber);

            const realSessionsMap = new Map(
                therapySessions.map((s) => [
                    s.sessionDate.toISOString().split('T')[0],
                    s,
                ]),
            );

            for (const date of matchingDates) {
                const dateKey = date.toISOString().split('T')[0];
                const realSession = realSessionsMap.get(dateKey);

                allSessions.push({
                    psychotherapyId,
                    user,
                    time,
                    attended: realSession ? realSession.attended : false,
                    date: dateKey,
                    simulated: !realSession,
                });
            }
        }

        const sessionsByDay = allSessions.reduce((acc, s) => {
            if (!acc[s.date]) acc[s.date] = [];
            acc[s.date].push({
                psychotherapyId: s.psychotherapyId,
                user: s.user,
                time: s.time,
                attended: s.attended,
                simulated: s.simulated,
            });
            return acc;
        }, {} as Record<string, any[]>);

        return {
            month,
            year,
            totalDays: new Date(year, month, 0).getDate(),
            sessionsByDay,
        };
    }

}
