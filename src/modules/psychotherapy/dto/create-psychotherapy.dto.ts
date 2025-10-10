import { IsInt, IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreatePsychotherapyDto {
  @IsInt()
  userId: number;

  @IsInt()
  psychologistId: number;

  @IsOptional()
  @IsString()
  @IsIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
    message: 'dayOfWeek must be a valid day name',
  })
  dayOfWeek?: string;
}