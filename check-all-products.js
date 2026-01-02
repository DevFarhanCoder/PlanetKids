const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllProducts() {
  try {
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        categories: {
          include: {
            category: {
              select: { name: true }
            }
          }
        }
      }
    });
    
    console.log(`📊 Total products in database: ${allProducts.length}\n`);
    
    allProducts.forEach(product => {
      console.log(`${product.isActive ? '✅' : '❌'} ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Active: ${product.isActive}`);
      console.log(`   Categories: ${product.categories.map(c => c.category.name).join(', ') || 'None'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllProducts();
