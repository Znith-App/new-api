import { IsInt, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTherapySessionDto {
  @IsInt()
  psychotherapyId: number;

  @IsDateString()
  sessionDate: string;

  @IsBoolean()
  @IsOptional()
  attended?: boolean;

  @IsOptional()
  @IsDateString()
  deletedAt?: string;
}