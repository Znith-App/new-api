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
}
