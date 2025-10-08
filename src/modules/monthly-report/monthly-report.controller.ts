import { Controller, Get, Param } from '@nestjs/common';
import { MonthlyReportService } from './monthly-report.service';
import { MonthlyReport } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Monthly Report')
@Controller('monthly-report')
export class MonthlyReportController {
  constructor(private readonly reportService: MonthlyReportService) { }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all monthly reports for a user' })
  async getUserReports(@Param('userId') userId: string): Promise<MonthlyReport[]> {
    return this.reportService.getReports(Number(userId));
  }

  @Get(':userId/latest')
  @ApiOperation({ summary: 'Get the latest monthly report for a user' })
  async getLatestReport(@Param('userId') userId: string): Promise<MonthlyReport | null> {
    return this.reportService.getLatestReport(Number(userId));
  }

  @Get(':userId/generate')
  @ApiOperation({ summary: 'Generate monthly report for a user (test only)' })
  async generateReportNow(@Param('userId') userId: string): Promise<MonthlyReport | null> {
    return this.reportService.generateMonthlyReport(Number(userId));
  }
}
