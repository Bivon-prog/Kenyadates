import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, wallet: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
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
}
