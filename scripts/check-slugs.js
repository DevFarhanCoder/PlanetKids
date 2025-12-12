const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSlugs() {
  const subcategories = await prisma.category.findMany({
    where: { 
      parentId: { not: null } 
    },
    select: {
      name: true,
      slug: true,
      parent: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: { displayOrder: 'asc' },
    take: 10
  });

  console.log('Sample subcategory slugs:');
  subcategories.forEach(cat => {
    console.log(`${cat.parent.name} > ${cat.name}`);
    console.log(`  Slug: ${cat.slug}`);
    console.log(`  Expected URL: /categories/${cat.slug}\n`);
  });

  await prisma.$disconnect();
}

checkSlugs();
