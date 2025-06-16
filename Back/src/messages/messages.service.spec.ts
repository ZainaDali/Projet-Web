import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockCreate = jest.fn();
  const mockFindMany = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: PrismaService,
          useValue: {
            message: {
              create: mockCreate,
              findMany: mockFindMany,
            },
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a message', async () => {
    const mockMessage = {
      id: 'msg1',
      content: 'Hello',
      senderId: 'user1',
      conversationId: 'conv1',
      createdAt: new Date(),
    };

    mockCreate.mockResolvedValue(mockMessage);

    const result = await service.create('Hello', 'user1', 'conv1');

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        content: 'Hello',
        senderId: 'user1',
        conversationId: 'conv1',
      },
    });

    expect(result).toEqual(mockMessage);
  });

  it('should find messages by conversation ID', async () => {
    const mockMessages = [
      {
        id: 'msg1',
        content: 'Hello',
        senderId: 'user1',
        conversationId: 'conv1',
        createdAt: new Date(),
      },
      {
        id: 'msg2',
        content: 'Hi',
        senderId: 'user2',
        conversationId: 'conv1',
        createdAt: new Date(),
      },
    ];

    mockFindMany.mockResolvedValue(mockMessages);

    const result = await service.findByConversation('conv1');

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { conversationId: 'conv1' },
      orderBy: { createdAt: 'asc' },
    });

    expect(result).toEqual(mockMessages);
  });
});
