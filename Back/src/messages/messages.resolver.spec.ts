import { Test, TestingModule } from '@nestjs/testing';
import { MessagesResolver } from './message.resolver';
import { MessagesService } from './messages.service';
import { CreateMessageInput } from './dto/send-message.input';

describe('MessagesResolver', () => {
  let resolver: MessagesResolver;
  let service: MessagesService;

  const mockMessagesService = {
    create: jest.fn(),
    findByConversation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesResolver,
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    resolver = module.get<MessagesResolver>(MessagesResolver);
    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should send a message using sendMessage()', async () => {
    const input: CreateMessageInput = {
      content: 'Hello',
      senderId: 'user1',
      conversationId: 'conv1',
    };

    const mockMessage = {
      id: 'msg1',
      ...input,
      createdAt: new Date(),
    };

    mockMessagesService.create.mockResolvedValue(mockMessage);

    const result = await resolver.sendMessage(input);

    expect(result).toEqual(mockMessage);
    expect(service.create).toHaveBeenCalledWith('Hello', 'user1', 'conv1');
  });

  it('should get messages using getMessages()', async () => {
    const conversationId = 'conv1';
    const mockMessages = [
      {
        id: 'msg1',
        content: 'Hello',
        senderId: 'user1',
        conversationId: 'conv1',
        createdAt: new Date(),
      },
    ];

    mockMessagesService.findByConversation.mockResolvedValue(mockMessages);

    const result = await resolver.getMessages(conversationId);

    expect(result).toEqual(mockMessages);
    expect(service.findByConversation).toHaveBeenCalledWith(conversationId);
  });
});
