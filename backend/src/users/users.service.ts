import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'placeholder-key',
);

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getProfile(userId: string) {
    const cacheKey = `user:profile:${userId}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, wallet: true },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.cache.set(cacheKey, user, 60);
    return user;
  }

  async updateProfile(userId: string, data: any) {
    const res = await this.prisma.profile.update({
      where: { userId },
      data,
    });
    await this.cache.del(`user:profile:${userId}`);
    return res;
  }


  /**
   * Upload a photo to Supabase Storage and add the URL to the user's profile.
   */
  async uploadPhoto(userId: string, file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();
    const fileName = `profiles/${userId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('kenyadates-media')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('kenyadates-media')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Add URL to profile photos array
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const updatedPhotos = [...(profile?.photos ?? []), publicUrl];
    await this.prisma.profile.update({
      where: { userId },
      data: { photos: updatedPhotos },
    });

    return { url: publicUrl };
  }

  /**
   * Upload a voice note to Supabase Storage and return its URL.
   */
  async uploadVoiceNote(userId: string, file: Express.Multer.File) {
    const fileName = `voice/${userId}/${Date.now()}.webm`;

    const { error } = await supabase.storage
      .from('kenyadates-media')
      .upload(fileName, file.buffer, {
        contentType: 'audio/webm',
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Voice upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('kenyadates-media')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl };
  }

  /**
   * Mock KYC verification — simulates a Smile Identity / face check.
   * Sets status to PENDING immediately, then VERIFIED after a 2s delay.
   */
  async requestVerification(userId: string, selfieUrl?: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: 'PENDING' },
    });

    // Simulate async KYC processing (2 seconds)
    setTimeout(async () => {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: { verificationStatus: 'VERIFIED' },
        });
      } catch {
        // ignore if user was deleted
      }
    }, 2000);

    return {
      success: true,
      message: 'Verification submitted. You will be verified shortly.',
      status: 'PENDING',
    };
  }

  /**
   * Block a user — creates a Report entry with BLOCKED reason and deletes any active match.
   */
  async blockUser(userId: string, targetUserId: string, reason?: string) {
    await this.prisma.$transaction([
      this.prisma.report.create({
        data: {
          reporterId: userId,
          reportedUserId: targetUserId,
          reason: reason || 'BLOCKED',
          description: 'User blocked via profile / chat actions.',
        },
      }),
      this.prisma.match.deleteMany({
        where: {
          OR: [
            { user1Id: userId, user2Id: targetUserId },
            { user1Id: targetUserId, user2Id: userId },
          ],
        },
      }),
      this.prisma.like.deleteMany({
        where: {
          OR: [
            { fromUserId: userId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: userId },
          ],
        },
      }),
    ]);

    return { success: true, message: 'User blocked successfully.' };
  }

  /**
   * Unmatch a user — removes match record and any likes.
   */
  async unmatchUser(userId: string, targetUserId: string) {
    await this.prisma.$transaction([
      this.prisma.match.deleteMany({
        where: {
          OR: [
            { user1Id: userId, user2Id: targetUserId },
            { user1Id: targetUserId, user2Id: userId },
          ],
        },
      }),
      this.prisma.like.deleteMany({
        where: {
          OR: [
            { fromUserId: userId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: userId },
          ],
        },
      }),
    ]);

    return { success: true, message: 'Unmatched successfully.' };
  }

  /**
   * Delete current logged-in user account.
   */
  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true, message: 'Account deleted permanently.' };
  }
}
