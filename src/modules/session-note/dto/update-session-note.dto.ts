import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionNoteDto } from './create-session-note.dto';

export class UpdateSessionNoteDto extends PartialType(CreateSessionNoteDto) {}