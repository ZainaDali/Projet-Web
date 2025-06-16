import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { getQueueToken } from '@nestjs/bull';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getQueueToken('message'),
          useValue: {
            add: jest.fn(),
            // autres méthodes mockées si besoin
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
