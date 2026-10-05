export const CURATED_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", // Amina
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80", // Wanjiru
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80", // Fatuma
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80", // Kemunto
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80", // Njeri
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80", // Grace
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", // James
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", // Kevin
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", // Sharon
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80", // Brian
];

/**
 * Returns a guaranteed valid HD photo URL.
 * Replaces null, undefined, empty, solid:#color, and gradient:#color strings
 * with curated Unsplash portrait photos.
 */
export function getProfileAvatar(photo?: string | null, name?: string | null, index = 0): string {
  if (photo && typeof photo === "string" && photo.startsWith("http")) {
    return photo;
  }
  
  // Calculate deterministic index based on name or index
  let hash = index;
  if (name) {
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
  }
  
  return CURATED_AVATARS[Math.abs(hash) % CURATED_AVATARS.length];
}
