const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dyypvkphuycctsluwqew.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eXB2a3BodXljY3RzbHV3cWV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDMxNTc1MCwiZXhwIjoyMTA1ODkxNzUwfQ.1iMm8ExEjVgU5nwgmo7_sbIrq6o6etIJlzb2t8MYsOg'
);

async function setup() {
  // Create the storage bucket
  const { data, error } = await supabase.storage.createBucket('kenyadates-media', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/ogg'],
  });

  if (error && error.message !== 'The resource already exists') {
    console.error('❌ Failed to create bucket:', error.message);
    process.exit(1);
  }

  console.log('✅ Storage bucket "kenyadates-media" is ready!');

  // List buckets to confirm
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('📦 Available buckets:', buckets?.map(b => b.name).join(', '));
}

setup();
