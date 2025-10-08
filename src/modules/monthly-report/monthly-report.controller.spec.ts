import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyReportController } from './monthly-report.controller';

describe('MonthlyReportController', () => {
  let controller: MonthlyReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyReportController],
    }).compile();

    controller = module.get<MonthlyReportController>(MonthlyReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
