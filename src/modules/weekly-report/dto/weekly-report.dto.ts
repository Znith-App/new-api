import { ApiProperty } from '@nestjs/swagger';
import { Mood } from '@prisma/client';

export class WeeklyReportDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: Mood, required: false })
  averageMood?: Mood;

  @ApiProperty({
    description: 'Distribuição percentual de humores na semana',
    example: {
      VERY_SAD: 10,
      SAD: 20,
      NEUTRAL: 40,
      HAPPY: 20,
      VERY_HAPPY: 10,
    },
  })
  moodDistribution: Record<Mood, number>;

  @ApiProperty()
  notesCount: number;

  @ApiProperty()
  completedGoals: number;

  @ApiProperty()
  pendingGoals: number;

  @ApiProperty({ description: 'Tendência em relação à semana anterior (-1 = piora, 0 = igual, 1 = melhora)' })
  moodTrend?: number;

  @ApiProperty({ description: 'Hora do dia mais comum para anotações' })
  mostActiveHour?: number;

  @ApiProperty({ description: 'Número de dias com registros na semana' })
  daysActive: number;

  @ApiProperty({ description: 'Indica se houve sequência de dias tristes' })
  alert: boolean;

  @ApiProperty({ required: false })
  therapistNotes?: string;

  @ApiProperty()
  createdAt: Date;
}
