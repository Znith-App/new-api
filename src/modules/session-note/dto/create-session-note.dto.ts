import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateSessionNoteDto {
  @IsInt()
  @IsOptional()
  therapySessionId?: number;

  @IsString()
  noteText: string;
}