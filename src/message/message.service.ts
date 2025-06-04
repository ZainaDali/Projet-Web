import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageInput } from './dto/send-message.input';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: SendMessageInput, senderId: string) {
  return this.prisma.message.create({
    data: {
      content: data.content,
      senderId: senderId,
      receiverId: data.toUserId, // ✅ ici on utilise maintenant le destinataire
    },
    include: {
      sender: true,
      receiver: true, // ✅ inclure receiver
    },
  });
}

  

  async findAllMessages() {
    return this.prisma.message.findMany({
      include: {
        sender: true,
      },
    });
  }

  async findMessagesByUser(userId: string) {
    return this.prisma.message.findMany({
      where: { senderId: userId },
      include: {
        sender: true,
      },
    });
  }
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
  
    if (!message || message.senderId !== userId) {
      throw new Error('Not authorized to delete this message');
    }
  
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
  
}
