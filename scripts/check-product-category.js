const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProduct() {
  try {
    // Get the Apple MacBook product with its categories
    const product = await prisma.product.findFirst({
      where: { slug: 'apple-macbook' },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    console.log('Product:', product.name);
    console.log('Slug:', product.slug);
    console.log('Is Active:', product.isActive);
    console.log('\nCategories:');
    product.categories.forEach(pc => {
      console.log(`  - ${pc.category.name} (slug: ${pc.category.slug}, id: ${pc.categoryId})`);
    });

    // Check if Coding Toys category exists
    const codingToys = await prisma.category.findFirst({
      where: { slug: 'electronic-stem-toys-coding-toys' },
      include: {
        products: {
          include: {
            product: {
              select: {
                name: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    console.log('\n\nCoding Toys Category:');
    console.log('Name:', codingToys?.name);
    console.log('Slug:', codingToys?.slug);
    console.log('Products in this category:');
    codingToys?.products.forEach(pc => {
      console.log(`  - ${pc.product.name} (Active: ${pc.product.isActive})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();
