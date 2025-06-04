import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(title: string | null, participantIds: string[]) {
    return this.prisma.conversation.create({
      data: {
        title,
        participants: {
          connect: participantIds.map(id => ({ id })),
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.conversation.findMany({
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
  }

  async findUserConversations(userId: string) {
  return this.prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          id: userId
        }
      }
    },
    include: {
      participants: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1 // dernier message
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
}

}
