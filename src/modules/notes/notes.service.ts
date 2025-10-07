import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Mood, NoteSize } from '@prisma/client';
import { UpdateNoteDto } from './dto/update-note.dto';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class NotesService {
    constructor(private readonly prisma: PrismaService) { }

    async createEmpty(userId: number) {
        const total = await this.prisma.note.count({
            where: { userId },
        });

        const newNote = await this.prisma.note.create({
            data: {
                userId,
                title: `Anotação #${total + 1}`,
                content: '',
                mood: Mood.NEUTRAL,
                size: NoteSize.MEDIUM,
            },
        });

        return newNote;
    }

    async findAllByUser(userId: number) {
        return this.prisma.note.findMany({
            where: { userId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: { color: true },
        });
    }

    async findOne(id: number) {
        const note = await this.prisma.note.findUnique({
            where: { id },
            include: { color: true },
        });

        if (!note || note.deletedAt) throw new NotFoundException('Nota não encontrada');
        return note;
    }

    async update(id: number, dto: UpdateNoteDto) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.deletedAt) throw new NotFoundException('Nota não encontrada');

        const sanitizedContent = dto.content
            ? sanitizeHtml(dto.content, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ['src', 'alt', 'width', 'height'],
                },
            })
            : note.content;

        return this.prisma.note.update({
            where: { id },
            data: {
                title: dto.title ?? note.title,
                content: sanitizedContent,
                mood: dto.mood ?? note.mood,
                size: dto.size ?? note.size,
            },
        });
    }

    async remove(id: number) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.deletedAt) throw new NotFoundException('Nota não encontrada');

        return this.prisma.note.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}