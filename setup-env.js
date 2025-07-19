const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

console.log('🚀 FormMirror Environment Setup');
console.log('==============================');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please update it manually with your Supabase credentials.');
  console.log('📁 File location:', envPath);
} else {
  // Create .env.local template
  const envTemplate = `# Supabase Configuration
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Instructions:
# 1. Go to your Supabase project dashboard
# 2. Go to Settings > API
# 3. Copy the URL and keys
# 4. Replace the placeholder values above
# 5. Generate a random string for NEXTAUTH_SECRET
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
  console.log('📁 File location:', envPath);
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Open .env.local in your editor');
  console.log('2. Replace placeholder values with your actual Supabase credentials');
  console.log('3. Restart your development server');
  console.log('');
  console.log('🔗 Get your Supabase credentials from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api');
}

console.log('');
console.log('🧪 To test tracking:');
console.log('1. Start your development server: npm run dev');
console.log('2. Visit: http://localhost:3000/test-tracking');
console.log('3. Open browser console (F12) to see tracking logs');
console.log('4. Fill out the test form to trigger events'); 