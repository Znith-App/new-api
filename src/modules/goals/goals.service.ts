import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, dto: CreateGoalDto) {
        return this.prisma.goal.create({
            data: {
                userId,
                title: dto.title,
                description: dto.description,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                status: dto.status ?? 'PENDING',
            },
        });
    }

    async findAllByUser(userId: number) {
        return this.prisma.goal.findMany({
            where: { userId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const goal = await this.prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.deletedAt) throw new NotFoundException('Goal not found');
        return goal;
    }

    async update(id: number, dto: UpdateGoalDto) {
        const goal = await this.prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.deletedAt) throw new NotFoundException('Goal not found');

        return this.prisma.goal.update({
            where: { id },
            data: {
                title: dto.title ?? goal.title,
                description: dto.description ?? goal.description,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : goal.dueDate,
                status: dto.status ?? goal.status,
            },
        });
    }

    async remove(id: number) {
        const goal = await this.prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.deletedAt) throw new NotFoundException('Goal not found');

        return this.prisma.goal.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async toggleStatus(id: number) {
        const goal = await this.prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.deletedAt) throw new NotFoundException('Goal not found');

        const newStatus = goal.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

        return this.prisma.goal.update({
            where: { id },
            data: { status: newStatus },
        });
    }

    async cancelGoal(id: number) {
        const goal = await this.prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.deletedAt) throw new NotFoundException('Goal not found');

        return this.prisma.goal.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }

    async markOutdated(id: number) {
        const goal = await this.prisma.goal.findUnique({ where: { id } });
        if (!goal || goal.deletedAt) throw new NotFoundException('Goal not found');

        return this.prisma.goal.update({
            where: { id },
            data: { status: 'OUTDATED' },
        });
    }

}
