import { IsInt, IsOptional, IsString, IsIn, IsNotEmpty } from 'class-validator';

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
  dayOfWeek: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'time must not be empty if provided' })
  time: string; 

  @IsOptional()
  @IsInt({ message: 'sessionDuration must be an integer (minutes)' })
  sessionDuration?: number;
}