const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRattlesCategory() {
  try {
    // Find the Rattles category
    const category = await prisma.category.findFirst({
      where: { slug: 'rattles' },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                isActive: true,
                slug: true
              }
            }
          }
        }
      }
    });
    
    if (!category) {
      console.log('❌ Rattles category not found');
      return;
    }
    
    console.log('✅ Category:', category.name);
    console.log('📦 Total products linked:', category.products.length);
    console.log('\nProducts:');
    category.products.forEach(pc => {
      console.log(`  - ${pc.product.name} (${pc.product.isActive ? '✅ Active' : '❌ Inactive'})`);
    });
    
    // Check if there are any products at all
    const allProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true }
    });
    
    console.log(`\n📊 Total active products in system: ${allProducts.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRattlesCategory();
