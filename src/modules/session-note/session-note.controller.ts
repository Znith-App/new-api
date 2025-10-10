import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SessionNoteService } from './session-note.service';
import { CreateSessionNoteDto } from './dto/create-session-note.dto';
import { UpdateSessionNoteDto } from './dto/update-session-note.dto';

@ApiTags('Session Notes')
@Controller('session-notes')
export class SessionNoteController {
  constructor(private readonly sessionNoteService: SessionNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session note' })
  async create(@Body() createDto: CreateSessionNoteDto) {
    return this.sessionNoteService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all session notes' })
  async findAll() {
    return this.sessionNoteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session note by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionNoteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session note by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSessionNoteDto,
  ) {
    return this.sessionNoteService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session note by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionNoteService.remove(id);
  }
}