import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getUserMatches(userId: string) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async getMessages(matchId: string) {
    return this.prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMessage(matchId: string, senderId: string, content: string) {
    let translatedText = null;
    const lower = content.toLowerCase();
    if (lower.includes('habari') || lower.includes('mambo') || lower.includes('sasa')) {
      translatedText = 'Hello / How are you?';
    } else if (lower.includes('poa') || lower.includes('freshi')) {
      translatedText = 'Good / I am fine!';
    } else if (lower.includes('nakupenda') || lower.includes('unakaa poa')) {
      translatedText = 'I love you / You look great!';
    }

    return this.prisma.message.create({
      data: {
        matchId,
        senderId,
        content,
        translatedText,
      },
    });
  }
}
