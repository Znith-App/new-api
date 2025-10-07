import { IsString, IsOptional, IsDateString, MaxLength, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateGoalDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
