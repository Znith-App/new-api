import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';

@Injectable()
export class ColorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateColorDto) {
    const existing = await this.prisma.color.findUnique({
      where: { hexCode: dto.hexCode },
    });

    if (existing) {
      throw new ConflictException('Color with this hex code already exists');
    }

    return this.prisma.color.create({
      data: {
        name: dto.name,
        hexCode: dto.hexCode,
      },
    });
  }

  async findAll() {
    return this.prisma.color.findMany({
      orderBy: { name: 'asc' },
    });
  }
}