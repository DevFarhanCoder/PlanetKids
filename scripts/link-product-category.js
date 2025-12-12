const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkProductToCategory() {
  try {
    // Get the product
    const product = await prisma.product.findFirst({
      where: { slug: 'testing-product' }
    });

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    // Get the Coding Toys category
    const category = await prisma.category.findFirst({
      where: { slug: 'electronic-stem-toys-coding-toys' }
    });

    if (!category) {
      console.log('❌ Category not found');
      return;
    }

    // Delete existing product categories
    await prisma.productCategory.deleteMany({
      where: { productId: product.id }
    });

    // Create the link
    await prisma.productCategory.create({
      data: {
        productId: product.id,
        categoryId: category.id
      }
    });

    console.log('✅ Successfully linked product to category!');
    console.log(`   Product: ${product.name}`);
    console.log(`   Category: ${category.name}`);

    // Verify
    const updated = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    console.log('\n✅ Verification:');
    console.log(`   Product: ${updated.name}`);
    console.log(`   Categories: ${updated.categories.map(pc => pc.category.name).join(', ')}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkProductToCategory();
