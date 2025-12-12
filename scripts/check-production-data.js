const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProductionData() {
  try {
    // Check all products with their categories
    const products = await prisma.product.findMany({
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    console.log(`\n📦 Total Products: ${products.length}\n`);
    
    products.forEach(product => {
      console.log(`Product: ${product.name}`);
      console.log(`  ID: ${product.id}`);
      console.log(`  Active: ${product.isActive}`);
      console.log(`  Categories: ${product.categories.map(pc => `${pc.category.name} (${pc.category.slug})`).join(', ') || '❌ NONE'}`);
      console.log('');
    });

    // Check Coding Toys category
    const codingToysCategory = await prisma.category.findFirst({
      where: { 
        slug: 'electronic-stem-toys-coding-toys'
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    if (codingToysCategory) {
      console.log(`\n🎯 Coding Toys Category:`);
      console.log(`  Name: ${codingToysCategory.name}`);
      console.log(`  Slug: ${codingToysCategory.slug}`);
      console.log(`  Products Count: ${codingToysCategory.products.length}`);
      if (codingToysCategory.products.length > 0) {
        console.log(`  Products:`);
        codingToysCategory.products.forEach(pc => {
          console.log(`    - ${pc.product.name} (Active: ${pc.product.isActive})`);
        });
      } else {
        console.log(`  ❌ No products linked to this category`);
      }
    } else {
      console.log(`\n❌ Coding Toys category not found!`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionData();
