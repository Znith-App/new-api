import { Test, TestingModule } from '@nestjs/testing';
import { PsychotherapyController } from './psychotherapy.controller';

describe('PsychotherapyController', () => {
  let controller: PsychotherapyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsychotherapyController],
    }).compile();

    controller = module.get<PsychotherapyController>(PsychotherapyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
