import { Controller, Get, Query, Param } from '@nestjs/common';
import { WeeklyReportService } from './weekly-report.service';
import { GetWeeklyReportDto } from './dto/get-weekly-report.dto';
import { WeeklyReport } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Weekly Report')
@Controller('weekly-report')
export class WeeklyReportController {
    constructor(private readonly reportService: WeeklyReportService) { }

    @Get(':userId')
    @ApiOperation({ summary: 'Get weekly reports for a user' })
    async getUserReports(@Param('userId') userId: string, @Query() query: GetWeeklyReportDto): Promise<WeeklyReport[]> {
        return this.reportService.getReports(Number(userId), query.startDate, query.endDate);
    }

    @Get(':userId/latest')
    @ApiOperation({ summary: 'Get the latest weekly report for a user' })
    async getLatestReport(@Param('userId') userId: string): Promise<WeeklyReport | null> {
        return this.reportService.getLatestReport(Number(userId));
    }

    @Get(':userId/generate-now')
    @ApiOperation({ summary: 'Generate weekly report immediately for a user' })
    async generateNow(@Param('userId') userId: string): Promise<WeeklyReport> {
        return this.reportService.generateWeeklyReport(Number(userId));
    }
}