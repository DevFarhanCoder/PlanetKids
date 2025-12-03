const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCategories() {
  try {
    console.log('🌱 Starting category seeding...\n');

    const categories = [
      {
        name: 'School Essentials',
        slug: 'school-essentials',
        description: 'Everything your child needs for school - from uniforms to study materials',
        subcategories: ['Backpacks', 'School Bags', 'Lunch Boxes', 'Water Bottles', 'Stationary']
      },
      {
        name: 'Toys and Games',
        slug: 'toys-and-games',
        description: 'Fun and engaging toys to spark imagination and creativity',
        subcategories: ['Action Figures', 'Building Blocks', 'Board Games', 'Puzzles', 'Educational Toys']
      },
      {
        name: 'Art & Craft',
        slug: 'art-craft',
        description: 'Unleash creativity with our art and craft supplies',
        subcategories: ['Drawing Supplies', 'Painting Kits', 'Craft Kits', 'Coloring Books']
      },
      {
        name: 'Gift Hampers',
        slug: 'hampers',
        description: 'Thoughtfully curated gift hampers for every occasion',
        subcategories: ['Birthday Hampers', 'Festival Hampers', 'Return Gifts']
      },
      {
        name: 'Kids Accessories',
        slug: 'kids-accessories',
        description: 'Stylish accessories for kids',
        subcategories: ['Hair Accessories', 'Jewelry', 'Bags', 'Watches']
      },
      {
        name: 'Everyday Essentials',
        slug: 'everyday-essentials',
        description: 'Daily necessities for your little ones',
        subcategories: ['Baby Care', 'Bath & Body', 'Health & Safety', 'Clothing']
      },
      {
        name: 'Travel Bag & Accessories',
        slug: 'travel-accessories',
        description: 'Travel gear for kids on the go',
        subcategories: ['Travel Bags', 'Suitcases', 'Travel Games']
      },
      {
        name: 'Books, Learning Kits',
        slug: 'books-learning-kits',
        description: 'Educational books and learning materials',
        subcategories: ['Picture Books', 'Activity Books', 'Learning Kits', 'Story Books']
      }
    ];

    for (const category of categories) {
      // Create main category
      const parentCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          isActive: true
        }
      });

      console.log(`✅ Created: ${category.name}`);

      // Create subcategories
      for (const subName of category.subcategories) {
        const subSlug = `${category.slug}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        
        await prisma.category.create({
          data: {
            name: subName,
            slug: subSlug,
            description: `${subName} in ${category.name}`,
            parentId: parentCategory.id,
            isActive: true
          }
        });

        console.log(`   ↳ ${subName}`);
      }

      console.log('');
    }

    console.log('✨ All categories seeded successfully!\n');
    console.log('📊 Summary:');
    const mainCount = await prisma.category.count({ where: { parentId: null } });
    const subCount = await prisma.category.count({ where: { parentId: { not: null } } });
    console.log(`   Main Categories: ${mainCount}`);
    console.log(`   Subcategories: ${subCount}`);
    console.log(`   Total: ${mainCount + subCount}\n`);

    console.log('🎯 Next steps:');
    console.log('   1. Go to http://localhost:3000/admin/categories');
    console.log('   2. View all categories and subcategories');
    console.log('   3. Go to http://localhost:3000/admin/products/add');
    console.log('   4. Start adding products to these categories!\n');

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories()
  .then(() => {
    console.log('✅ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
