const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database...');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found. Please create it with your database configuration.');
  process.exit(1);
}

try {
  // Generate migration files
  console.log('📝 Generating migration files...');
  execSync('npm run db:generate', { stdio: 'inherit' });

  // Run migrations
  console.log('🔄 Running database migrations...');
  execSync('npm run db:migrate', { stdio: 'inherit' });

  console.log('✅ Database setup completed successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Update your .env.local file with correct database credentials');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Visit http://localhost:3000 to access the application');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}
