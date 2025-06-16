import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  const mockFindUnique = jest.fn();
  const mockCreate = jest.fn();
  const mockFindMany = jest.fn();

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: mockFindUnique,
              create: mockCreate,
              findMany: mockFindMany,
            },
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user', async () => {
    mockFindUnique.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
    mockCreate.mockResolvedValue({ id: '1', username: 'zaza' });

    const result = await service.register({ username: 'zaza', password: '1234' });

    expect(mockCreate).toHaveBeenCalledWith({
      data: { username: 'zaza', password: 'hashed123' },
    });
    expect(result).toEqual({ id: '1', username: 'zaza' });
  });

  it('should throw if username already exists', async () => {
    mockFindUnique.mockResolvedValue({ id: '1', username: 'zaza' });

    await expect(
      service.register({ username: 'zaza', password: '1234' }),
    ).rejects.toThrow('Username already taken');
  });

  it('should login and return token', async () => {
    mockFindUnique.mockResolvedValue({
      id: '1',
      username: 'zaza',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const token = await service.login({ username: 'zaza', password: '1234' });

    expect(token).toBe('mock-jwt-token');
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: '1', username: 'zaza' });
  });

  it('should throw if user not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      service.login({ username: 'zaza', password: '1234' }),
    ).rejects.toThrow('User not found');
  });

  it('should throw if password invalid', async () => {
    mockFindUnique.mockResolvedValue({
      id: '1',
      username: 'zaza',
      password: 'hashed',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ username: 'zaza', password: 'wrong' }),
    ).rejects.toThrow('Invalid password');
  });

  it('should find user by ID', async () => {
    mockFindUnique.mockResolvedValue({ id: '1', username: 'zaza' });

    const result = await service.findById('1');

    expect(result).toEqual({ id: '1', username: 'zaza' });
  });

  it('should throw if ID is undefined', async () => {
    await expect(service.findById(undefined as any)).rejects.toThrow('User ID is undefined');
  });

  it('should return all users', async () => {
    const users = [
      { id: '1', username: 'zaza', createdAt: new Date() },
      { id: '2', username: 'dali', createdAt: new Date() },
    ];

    mockFindMany.mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
  });
});
