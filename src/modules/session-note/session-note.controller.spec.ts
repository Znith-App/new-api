import { Test, TestingModule } from '@nestjs/testing';
import { SessionNoteController } from './session-note.controller';

describe('SessionNoteController', () => {
  let controller: SessionNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionNoteController],
    }).compile();

    controller = module.get<SessionNoteController>(SessionNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
