const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Create Admin User
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@planetkids.com' }
    });

    if (!admin) {
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

    // Create Categories
    console.log('\nCreating categories...');
    const existingCategories = await prisma.category.count();
    
    if (existingCategories > 0) {
      console.log(`✓ ${existingCategories} categories already exist`);
    } else {
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
      console.log(`  ✓ ${cat.name}`);
    }

    console.log(`\n✓ Created ${categories.length} categories`);
    }

    // Create Sample Products
    console.log('\nCreating sample products...');
    const firstCategory = await prisma.category.findFirst();
    
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      console.log(`✓ ${existingProducts} products already exist`);
    } else {
      const sampleProducts = [
        {
          name: 'Kids Winter Hoodie - Red',
          slug: 'kids-winter-hoodie-red',
          description: 'Warm and comfortable hoodie for kids',
          shortDescription: 'Warm winter hoodie',
          price: 899,
          compareAtPrice: 1499,
          sku: 'KWH-RED-001',
          quantity: 50,
          trackInventory: true,
          isActive: true,
          isFeatured: true,
          categories: {
            create: {
              categoryId: firstCategory.id
            }
          }
        },
        {
          name: 'Girls Pink Sweatshirt',
          slug: 'girls-pink-sweatshirt',
          description: 'Stylish pink sweatshirt for girls',
          shortDescription: 'Stylish pink sweatshirt',
          price: 799,
          compareAtPrice: 1299,
          sku: 'GPS-PINK-001',
          quantity: 45,
          trackInventory: true,
          isActive: true,
          isFeatured: true,
          categories: {
            create: {
              categoryId: firstCategory.id
            }
          }
        },
        {
          name: 'Boys Blue Jacket',
          slug: 'boys-blue-jacket',
          description: 'Stylish blue jacket for boys',
          shortDescription: 'Stylish blue jacket',
          price: 1299,
          compareAtPrice: 2199,
          sku: 'BBJ-BLUE-001',
          quantity: 30,
          trackInventory: true,
          isActive: true,
          isFeatured: true,
          categories: {
            create: {
              categoryId: firstCategory.id
            }
          }
        }
      ];

      for (const product of sampleProducts) {
        await prisma.product.create({ data: product });
        console.log(`  ✓ ${product.name}`);
      }

      console.log(`\n✓ Created ${sampleProducts.length} sample products`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Admin Login Credentials:');
    console.log('   Email: admin@planetkids.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
