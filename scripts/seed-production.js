const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use production DATABASE_URL from Vercel
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function seedProduction() {
  try {
    console.log('🌱 Seeding production database...\n');

    // Check if admin exists
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@planetkids.com' }
    });

    if (!admin) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      admin = await prisma.user.create({
        data: {
          email: 'admin@planetkids.com',
          name: 'Admin',
          password: hashedPassword,
          role: 'ADMIN',
          phone: '+919876543210'
        }
      });
      console.log(`✓ Admin created: ${admin.email}`);
    } else {
      console.log(`✓ Admin already exists: ${admin.email}`);
    }

    // Check categories
    const categoryCount = await prisma.category.count();
    console.log(`\n✓ Found ${categoryCount} categories`);

    if (categoryCount === 0) {
      console.log('Creating categories...');
      const categories = [
        { name: 'Hoodies', slug: 'hoodies', icon: '🧥', isActive: true, displayOrder: 1 },
        { name: 'Sweatshirts', slug: 'sweatshirts', icon: '👕', isActive: true, displayOrder: 2 },
        { name: 'Winter Sets', slug: 'winter-sets', icon: '🎿', isActive: true, displayOrder: 3 },
        { name: 'Pullovers', slug: 'pullovers', icon: '🧶', isActive: true, displayOrder: 4 },
        { name: 'Jackets', slug: 'jackets', icon: '🧥', isActive: true, displayOrder: 5 },
        { name: 'Coats', slug: 'coats', icon: '🧥', isActive: true, displayOrder: 6 },
        { name: 'Sweaters', slug: 'sweaters', icon: '👔', isActive: true, displayOrder: 7 },
        { name: 'Accessories', slug: 'accessories', icon: '🎒', isActive: true, displayOrder: 8 },
        { name: 'Ethnic Wear', slug: 'ethnic-wear', icon: '👘', isActive: true, displayOrder: 9 },
        { name: 'Party Wear', slug: 'party-wear', icon: '👗', isActive: true, displayOrder: 10 },
        { name: 'Diapers', slug: 'diapers', icon: '🍼', isActive: true, displayOrder: 11 },
        { name: 'Baby Wipes', slug: 'wipes', icon: '🧻', isActive: true, displayOrder: 12 },
        { name: 'Christmas Special', slug: 'christmas', icon: '🎄', isActive: true, displayOrder: 13 },
        { name: 'Wedding Store', slug: 'wedding', icon: '💒', isActive: true, displayOrder: 14 },
        { name: 'Summer Collection', slug: 'summer-collection', icon: '☀️', isActive: true, displayOrder: 15 },
        { name: 'Festive Wear', slug: 'festive-wear', icon: '🎊', isActive: true, displayOrder: 16 },
        { name: 'Casual Wear', slug: 'casual-wear', icon: '👖', isActive: true, displayOrder: 17 },
        { name: 'Boys', slug: 'boys', icon: '👦', isActive: true, displayOrder: 18 },
        { name: 'Girls', slug: 'girls', icon: '👧', isActive: true, displayOrder: 19 },
        { name: 'Kids', slug: 'kids', icon: '👶', isActive: true, displayOrder: 20 }
      ];

      for (const cat of categories) {
        await prisma.category.create({ data: cat });
      }
      console.log(`✓ Created ${categories.length} categories`);
    }

    // Check products
    const productCount = await prisma.product.count();
    console.log(`\n✓ Found ${productCount} products`);

    console.log('\n✅ Production database ready!');
    console.log('\n📝 Admin Login:');
    console.log('   Email: admin@planetkids.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding production:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProduction();
