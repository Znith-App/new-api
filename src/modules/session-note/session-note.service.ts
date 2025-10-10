import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionNoteDto } from './dto/create-session-note.dto';
import { UpdateSessionNoteDto } from './dto/update-session-note.dto';

@Injectable()
export class SessionNoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateSessionNoteDto) {
    return this.prisma.sessionNote.create({
      data: createDto,
      include: { therapySession: true },
    });
  }

  async findAll() {
    return this.prisma.sessionNote.findMany({
      include: { therapySession: true },
    });
  }

  async findOne(id: number) {
    const note = await this.prisma.sessionNote.findUnique({
      where: { id },
      include: { therapySession: true },
    });
    if (!note) throw new NotFoundException('Session note not found');
    return note;
  }

  async update(id: number, updateDto: UpdateSessionNoteDto) {
    const note = await this.prisma.sessionNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Session note not found');

    return this.prisma.sessionNote.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    const note = await this.prisma.sessionNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Session note not found');

    return this.prisma.sessionNote.delete({ where: { id } });
  }
}