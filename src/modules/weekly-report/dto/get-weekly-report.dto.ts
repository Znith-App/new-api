import { IsInt, IsOptional } from 'class-validator';

export class GetWeeklyReportDto {
  @IsInt()
  userId: number;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;
}