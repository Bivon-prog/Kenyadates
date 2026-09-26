import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ============================================================
// Swahili ↔ English smart translation dictionary
// ============================================================
const SWAHILI_TO_ENGLISH: Record<string, string> = {
  // Greetings
  habari: 'Hello / How are you?',
  mambo: 'What\'s up?',
  sasa: 'What\'s up? / Now',
  vipi: 'How is it going?',
  niaje: 'How are you? (informal)',
  uko: 'Are you / You are',
  salamu: 'Greetings / Hello',
  karibu: 'Welcome / You are welcome',
  asante: 'Thank you',
  tafadhali: 'Please',
  samahani: 'Sorry / Excuse me',
  // Responses
  poa: 'Good / Fine / Cool',
  freshi: 'Fresh / Great',
  sawa: 'Okay / Alright',
  nzuri: 'Good / Fine / Beautiful',
  sijambo: 'I am fine',
  // Affection
  nakupenda: 'I love you',
  napenda: 'I like / I love',
  unakaa: 'You look / You stay',
  mzuri: 'Good / Beautiful',
  mrembo: 'Beautiful (woman)',
  mwanaume: 'Man / Handsome',
  // Common phrases
  leo: 'Today',
  kesho: 'Tomorrow',
  siku: 'Day',
  usiku: 'Night',
  asubuhi: 'Morning',
  jioni: 'Evening',
  chakula: 'Food',
  maji: 'Water',
  nyumba: 'House / Home',
  familia: 'Family',
  rafiki: 'Friend',
  mapenzi: 'Love / Affection',
  ndio: 'Yes',
  hapana: 'No',
  sijui: 'I don\'t know',
  naomba: 'I request / I want',
  nataka: 'I want',
  ninakwenda: 'I am going',
  nitakupigia: 'I will call you',
  tutaonana: 'We will see each other / See you later',
  kwaheri: 'Goodbye',
  mpendwa: 'My dear / Beloved',
  babe: 'Babe',
  upendo: 'Love',
  furaha: 'Happiness / Joy',
  tuambie: 'Tell us',
  niambie: 'Tell me',
  unafanya: 'What are you doing',
  umefika: 'Have you arrived',
  uko wapi: 'Where are you',
  niko hapa: 'I am here',
  unaniambia: 'You are telling me',
  wewe: 'You',
  mimi: 'I / Me',
  sisi: 'We / Us',
};

function smartTranslate(text: string): string | null {
  const lower = text.toLowerCase().trim();
  // Check exact match
  if (SWAHILI_TO_ENGLISH[lower]) return SWAHILI_TO_ENGLISH[lower];

  // Check if any Swahili word is present in the message
  const matches: string[] = [];
  for (const [swahili, english] of Object.entries(SWAHILI_TO_ENGLISH)) {
    if (lower.includes(swahili)) {
      matches.push(`"${swahili}" = ${english}`);
    }
  }
  if (matches.length > 0) {
    return matches.join(' | ');
  }
  return null;
}

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
    const translatedText = smartTranslate(content);

    return this.prisma.message.create({
      data: {
        matchId,
        senderId,
        content,
        translatedText,
      },
    });
  }

  async markMessagesRead(matchId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(matchId: string, userId: string) {
    return this.prisma.message.count({
      where: {
        matchId,
        senderId: { not: userId },
        isRead: false,
      },
    });
  }
}
