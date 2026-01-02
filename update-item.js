const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateItem() {
  try {
    // Get the first category
    const category = await prisma.category.findFirst({
      where: { isActive: true }
    });
    
    if (!category) {
      console.log('No categories found');
      return;
    }
    
    // Update all home section items to use this category
    const result = await prisma.homeSectionItem.updateMany({
      data: {
        categoryId: category.id,
        link: `/categories/${category.slug}`
      }
    });
    
    console.log(`✅ Updated ${result.count} item(s)`);
    console.log(`Category: ${category.name}`);
    console.log(`Link: /categories/${category.slug}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateItem();
