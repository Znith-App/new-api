import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTherapySessionDto } from './dto/create-therapy-session.dto';
import { UpdateTherapySessionDto } from './dto/update-therapy-session.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, setHours, setMinutes, setSeconds } from 'date-fns';

@Injectable()
export class TherapySessionService {
  private readonly logger = new Logger(TherapySessionService.name);

  constructor(private readonly prisma: PrismaService) { }

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleWeeklySessions() {
    const nextWeekDay = addDays(new Date(), 7);
    const dayOfWeek = nextWeekDay.toLocaleDateString('en-US', { weekday: 'long' });

    this.logger.log(`🔁 Criando sessões automáticas para ${dayOfWeek} (daqui a 7 dias)...`);

    const therapies = await this.prisma.psychotherapy.findMany({
      where: {
        deletedAt: null,
        dayOfWeek,
      },
    });

    if (!therapies.length) {
      this.logger.log(`Nenhuma psicoterapia marcada para ${dayOfWeek}.`);
      return;
    }

    for (const therapy of therapies) {
      const [hours, minutes] = (therapy.time ?? '09:00').split(':').map(Number);

      // A sessão será no mesmo dia da semana, mas daqui a 7 dias
      const sessionDate = setHours(setMinutes(setSeconds(nextWeekDay, 0), minutes), hours);

      const existing = await this.prisma.therapySession.findFirst({
        where: { psychotherapyId: therapy.id, sessionDate },
      });

      if (!existing) {
        await this.prisma.therapySession.create({
          data: {
            psychotherapyId: therapy.id,
            sessionDate,
          },
        });
        this.logger.log(`✅ Sessão criada automaticamente para ${therapy.dayOfWeek} (#${therapy.id}) em ${sessionDate}`);
      }
    }

    this.logger.log(`🎯 Sessões de ${dayOfWeek} (daqui a 7 dias) criadas com sucesso.`);
  }
}