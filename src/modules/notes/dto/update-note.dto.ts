import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { Mood } from '@prisma/client';
import { NoteSize
    
 } from '@prisma/client';
export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(Mood)
  mood?: Mood;

  @IsOptional()
  @IsEnum(NoteSize)
  size?: NoteSize;
}