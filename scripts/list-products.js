const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    console.log(`\nTotal products: ${products.length}\n`);
    
    products.forEach(product => {
      console.log(`Product: ${product.name}`);
      console.log(`  Slug: ${product.slug}`);
      console.log(`  Active: ${product.isActive}`);
      console.log(`  Categories: ${product.categories.map(pc => pc.category.name).join(', ') || 'None'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
