import { Controller, Get, Post, Param, Patch, Body, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateNoteDto } from './dto/update-note.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    @Post(':userId')
    @ApiOperation({ summary: 'Creates an empty note for the user.' })
    create(@Param('userId') userId: string) {
        return this.notesService.createEmpty(Number(userId));
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Finds all notes for a specific user.' })
    findAll(@Param('userId') userId: string) {
        return this.notesService.findAllByUser(Number(userId));
    }

    @Get(':id')
    @ApiOperation({ summary:'Get a specific note by Id' })
    findOne(@Param('id') id: string) {
        return this.notesService.findOne(Number(id));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Updates a note by its ID.' })
    update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
        return this.notesService.update(Number(id), dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft deletes a note by its ID.' })
    remove(@Param('id') id: string) {
        return this.notesService.remove(Number(id));
    }
}
