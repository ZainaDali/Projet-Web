import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call register and return a user', async () => {
    const input: CreateUserInput = { username: 'zaza', password: '1234' };
    const mockUser = { id: '1', username: 'zaza' };

    mockUserService.register.mockResolvedValue(mockUser);

    const result = await resolver.register(input);
    expect(result).toEqual(mockUser);
    expect(mockUserService.register).toHaveBeenCalledWith(input);
  });

  it('should call login and return a token', async () => {
    const input: LoginInput = { username: 'zaza', password: '1234' };
    const token = 'mock-token';

    mockUserService.login.mockResolvedValue(token);

    const result = await resolver.login(input);
    expect(result).toBe(token);
    expect(mockUserService.login).toHaveBeenCalledWith(input);
  });

  it('should return hello string', () => {
    expect(resolver.hello()).toBe('Hello from GraphQL');
  });

  it('should return all users', async () => {
    const mockUsers = [
      { id: '1', username: 'zaza' },
      { id: '2', username: 'dali' },
    ];

    mockUserService.findAll.mockResolvedValue(mockUsers);

    const result = await resolver.findAll();
    expect(result).toEqual(mockUsers);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should return current user from me()', async () => {
    const mockUser = { id: '1', username: 'zaza' };
    const context = { user: { sub: '1' } };

    mockUserService.findById.mockResolvedValue(mockUser);

    const result = await resolver.me(context);
    expect(result).toEqual(mockUser);
    expect(mockUserService.findById).toHaveBeenCalledWith('1');
  });

  it('should return null if user is not authenticated in me()', async () => {
    mockUserService.findById.mockResolvedValue(null);

    const result = await resolver.me({}); // pas de req.user
    expect(result).toBeNull(); // ou toBe(undefined) selon ton service
    expect(mockUserService.findById).toHaveBeenCalledWith(undefined);
  });
});
