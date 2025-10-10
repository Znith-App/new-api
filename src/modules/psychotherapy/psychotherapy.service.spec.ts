import { Test, TestingModule } from '@nestjs/testing';
import { PsychotherapyService } from './psychotherapy.service';

describe('PsychotherapyService', () => {
  let service: PsychotherapyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PsychotherapyService],
    }).compile();

    service = module.get<PsychotherapyService>(PsychotherapyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
