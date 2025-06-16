import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsResolver } from './conversation.resolver';
import { ConversationsService } from './conversations.service';
import { CreateConversationInput } from './dto/create-conversation.input';

describe('ConversationsResolver', () => {
  let resolver: ConversationsResolver;
  let service: ConversationsService;

  const mockConversationsService = {
    create: jest.fn(),
    findUserConversations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsResolver,
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
        },
      ],
    }).compile();

    resolver = module.get<ConversationsResolver>(ConversationsResolver);
    service = module.get<ConversationsService>(ConversationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a conversation with createConversation()', async () => {
    const input: CreateConversationInput = {
      title: 'Test Chat',
      participantIds: ['user1', 'user2'],
    };

    const mockConversation = {
      id: 'conv1',
      title: 'Test Chat',
      participants: [],
      messages: [],
    };

    mockConversationsService.create.mockResolvedValue(mockConversation);

    const result = await resolver.createConversation(input);

    expect(result).toEqual(mockConversation);
    expect(service.create).toHaveBeenCalledWith('Test Chat', ['user1', 'user2']);
  });

  it('should return conversations for logged-in user (myConversations)', async () => {
    const mockConversations = [
      { id: 'conv1', participants: [], messages: [] },
    ];

    mockConversationsService.findUserConversations.mockResolvedValue(mockConversations);

    const result = await resolver.myConversations({ user: { sub: 'user1' } });

    expect(result).toEqual(mockConversations);
    expect(service.findUserConversations).toHaveBeenCalledWith('user1');
  });
});
