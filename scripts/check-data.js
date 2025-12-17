const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    const categories = await prisma.category.findMany({
      take: 15,
      select: {
        name: true,
        slug: true,
        isActive: true,
        isFeatured: true
      }
    });

    const products = await prisma.product.findMany({
      take: 10,
      select: {
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        isActive: true,
        isFeatured: true,
        ageGroup: true
      }
    });

    console.log('\n=== CATEGORIES ===');
    console.log(JSON.stringify(categories, null, 2));
    
    console.log('\n=== PRODUCTS ===');
    console.log(JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
