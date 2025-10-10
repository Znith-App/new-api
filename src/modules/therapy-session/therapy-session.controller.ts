import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TherapySessionService } from './therapy-session.service';
import { CreateTherapySessionDto } from './dto/create-therapy-session.dto';
import { UpdateTherapySessionDto } from './dto/update-therapy-session.dto';

@ApiTags('Therapy Sessions')
@Controller('therapy-sessions')
export class TherapySessionController {
  constructor(private readonly therapySessionService: TherapySessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new therapy session for a psychotherapy' })
  async create(@Body() createDto: CreateTherapySessionDto) {
    return this.therapySessionService.create(createDto);
  }

  @Get('psychotherapy/:psychotherapyId')
  @ApiOperation({ summary: 'Get all therapy sessions for a specific psychotherapy' })
  async findAllByPsychotherapy(@Param('psychotherapyId', ParseIntPipe) psychotherapyId: number) {
    return this.therapySessionService.findAllByPsychotherapy(psychotherapyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a therapy session by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.therapySessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a therapy session by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTherapySessionDto,
  ) {
    return this.therapySessionService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a therapy session by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.therapySessionService.remove(id);
  }
}