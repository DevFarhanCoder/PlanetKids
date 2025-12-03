const bcrypt = require('bcryptjs');

const password = 'admin123';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('\nHashed Password for "admin123":');
console.log(hashedPassword);
console.log('\n--- Instructions ---');
console.log('1. Copy the hashed password above');
console.log('2. Go to Prisma Studio at http://localhost:51212');
console.log('3. Click on the "User" model');
console.log('4. Click "Add record"');
console.log('5. Fill in:');
console.log('   - email: admin@planetkids.com');
console.log('   - password: [paste the hashed password]');
console.log('   - name: Admin');
console.log('   - role: ADMIN');
console.log('6. Click "Save 1 change"');
console.log('\nThen you can login at http://localhost:3000/admin/login');
