import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePsychotherapyDto } from './dto/create-psychotherapy.dto';
import { UpdatePsychotherapyDto } from './dto/update-psychotherapy.dto';

@Injectable()
export class PsychotherapyService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createDto: CreatePsychotherapyDto) {
        return this.prisma.psychotherapy.create({
            data: createDto,
            include: {
                user: true,
                psychologist: true,
                therapySessions: true,
            },
        });
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

        const sessions = await this.prisma.therapySession.findMany({
            where: {
                psychotherapy: {
                    psychologistId,
                },
                sessionDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                psychotherapy: {
                    include: {
                        user: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
            orderBy: {
                sessionDate: 'asc',
            },
        });

        const calendar = sessions.reduce((acc, session) => {
            const dateKey = session.sessionDate.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push({
                id: session.id,
                user: session.psychotherapy.user,
                time: session.sessionDate.toISOString().split('T')[1].slice(0, 5),
                attended: session.attended,
            });
            return acc;
        }, {} as Record<string, any[]>);

        return {
            month,
            year,
            totalDays: new Date(year, month, 0).getDate(),
            sessionsByDay: calendar,
        };
    }
}
