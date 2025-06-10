const bcrypt = require('bcryptjs');

async function testPasswords() {
  const demoPassword = 'demo2025';
  const adminPassword = 'admin2025';

  console.log('🔐 Testing password hashing...');

  // Hash the passwords
  const demoHash = await bcrypt.hash(demoPassword, 12);
  const adminHash = await bcrypt.hash(adminPassword, 12);

  console.log('Demo password hash:', demoHash);
  console.log('Admin password hash:', adminHash);

  // Test verification
  const demoCheck = await bcrypt.compare(demoPassword, demoHash);
  const adminCheck = await bcrypt.compare(adminPassword, adminHash);

  console.log('Demo password verification:', demoCheck);
  console.log('Admin password verification:', adminCheck);

  // Test against the hashes in our code
  const currentDemoHash = '$2a$12$LQv3c1yqBWVHxkd0LQ4YCOxYh2QMJE8K1HGjwmH.lWuEQA5nE5LN2';
  const currentAdminHash = '$2a$12$8Zg8J2ZgHgE3QWxgX3qMzOGfJhE6VtXdL5HgJgJhE3QWxgX3qMzOG';

  const currentDemoCheck = await bcrypt.compare(demoPassword, currentDemoHash);
  const currentAdminCheck = await bcrypt.compare(adminPassword, currentAdminHash);

  console.log('Current demo hash verification:', currentDemoCheck);
  console.log('Current admin hash verification:', currentAdminCheck);
}

testPasswords();
