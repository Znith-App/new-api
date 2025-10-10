import { Test, TestingModule } from '@nestjs/testing';
import { SessionNoteService } from './session-note.service';

describe('SessionNoteService', () => {
  let service: SessionNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionNoteService],
    }).compile();

    service = module.get<SessionNoteService>(SessionNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
