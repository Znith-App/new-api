import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTherapySessionDto } from './dto/create-therapy-session.dto';
import { UpdateTherapySessionDto } from './dto/update-therapy-session.dto';

@Injectable()
export class TherapySessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTherapySessionDto) {
    return this.prisma.therapySession.create({
      data: createDto,
      include: {
        psychotherapy: true,
        sessionNote: true,
      },
    });
  }

  async findAllByPsychotherapy(psychotherapyId: number) {
    return this.prisma.therapySession.findMany({
      where: { psychotherapyId, deletedAt: null },
      include: {
        sessionNote: true,
      },
      orderBy: { sessionDate: 'asc' },
    });
  }

  async findOne(id: number) {
    const session = await this.prisma.therapySession.findUnique({
      where: { id },
      include: { sessionNote: true, psychotherapy: true },
    });
    if (!session || session.deletedAt) throw new NotFoundException('Therapy session not found');
    return session;
  }

  async update(id: number, updateDto: UpdateTherapySessionDto) {
    const session = await this.prisma.therapySession.findUnique({ where: { id } });
    if (!session || session.deletedAt) throw new NotFoundException('Therapy session not found');

    return this.prisma.therapySession.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    const session = await this.prisma.therapySession.findUnique({ where: { id } });
    if (!session || session.deletedAt) throw new NotFoundException('Therapy session not found');

    return this.prisma.therapySession.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}