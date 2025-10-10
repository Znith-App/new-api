import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PsychotherapyService } from './psychotherapy.service';
import { CreatePsychotherapyDto } from './dto/create-psychotherapy.dto';
import { UpdatePsychotherapyDto } from './dto/update-psychotherapy.dto';

@ApiTags('Psychotherapy')
@Controller('psychotherapy')
export class PsychotherapyController {
  constructor(private readonly psychotherapyService: PsychotherapyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new psychotherapy relation between a patient and a psychologist' })
  async create(@Body() createDto: CreatePsychotherapyDto) {
    return this.psychotherapyService.create(createDto);
  }

  @Get('psychologist/:id')
  @ApiOperation({ summary: 'Get all psychotherapies of a specific psychologist' })
  async findAllByPsychologist(@Param('id', ParseIntPipe) id: number) {
    return this.psychotherapyService.findAllByPsychologist(id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all psychotherapies of a specific patient' })
  async findAllByUser(@Param('id', ParseIntPipe) id: number) {
    return this.psychotherapyService.findAllByUser(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific psychotherapy relation by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.psychotherapyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a psychotherapy relation by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePsychotherapyDto,
  ) {
    return this.psychotherapyService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a psychotherapy relation by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.psychotherapyService.remove(id);
  }
}