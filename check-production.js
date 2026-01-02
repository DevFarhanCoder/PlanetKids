const { PrismaClient } = require('@prisma/client');

// Use production DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function checkProductionData() {
  try {
    console.log('🔍 Checking production database...\n');
    
    // Check home sections
    const sections = await prisma.homeSection.findMany({
      include: {
        items: true
      }
    });
    
    console.log(`📦 Total Home Sections: ${sections.length}\n`);
    
    if (sections.length > 0) {
      sections.forEach(section => {
        console.log(`✅ ${section.name} (${section.slug})`);
        console.log(`   Type: ${section.sectionType}`);
        console.log(`   Active: ${section.isActive}`);
        console.log(`   Items: ${section.items.length}`);
        console.log('');
      });
    } else {
      console.log('❌ No sections found in production database');
    }
    
    // Check if new columns exist
    console.log('\n🔧 Checking schema...');
    const firstItem = await prisma.homeSectionItem.findFirst();
    if (firstItem) {
      console.log('✅ HomeSectionItem table exists');
      console.log(`   Has categoryId: ${firstItem.hasOwnProperty('categoryId')}`);
      console.log(`   Has productId: ${firstItem.hasOwnProperty('productId')}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P2021') {
      console.log('\n⚠️  Table does not exist - migrations not applied!');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionData();
