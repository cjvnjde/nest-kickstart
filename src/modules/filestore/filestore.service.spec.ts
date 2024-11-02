import { Test, TestingModule } from '@nestjs/testing';
import { FilestoreService } from './filestore.service';

describe('FilestoreService', () => {
  let service: FilestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilestoreService],
    }).compile();

    service = module.get<FilestoreService>(FilestoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
