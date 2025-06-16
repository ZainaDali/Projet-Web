import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ConversationsService', () => {
  let service: ConversationsService;

  const mockCreate = jest.fn();
  const mockFindMany = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: PrismaService,
          useValue: {
            conversation: {
              create: mockCreate,
              findMany: mockFindMany,
            },
          },
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a conversation with participants', async () => {
    const title = 'My Chat';
    const participantIds = ['user1', 'user2'];

    const mockConversation = {
      id: 'conv1',
      title,
      participants: [
        { id: 'user1', username: 'Zaza' },
        { id: 'user2', username: 'Dali' },
      ],
      messages: [],
    };

    mockCreate.mockResolvedValue(mockConversation);

    const result = await service.create(title, participantIds);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        title,
        participants: {
          connect: [{ id: 'user1' }, { id: 'user2' }],
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });

    expect(result).toEqual(mockConversation);
  });

  it('should find conversations for a user by ID', async () => {
    const userId = 'user1';

    const mockConversations = [
      {
        id: 'conv1',
        title: null,
        participants: [{ id: 'user1' }],
        messages: [],
      },
    ];

    mockFindMany.mockResolvedValue(mockConversations);

    const result = await service.findByUserId(userId);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: true,
        messages: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    expect(result).toEqual(mockConversations);
  });

  it('should return user conversations with latest message', async () => {
    const userId = 'user1';

    const mockConversations = [
      {
        id: 'conv1',
        participants: [{ id: 'user1' }],
        messages: [{ id: 'msg1', content: 'Hello', createdAt: new Date() }],
      },
    ];

    mockFindMany.mockResolvedValue(mockConversations);

    const result = await service.findUserConversations(userId);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    expect(result).toEqual(mockConversations);
  });
});
