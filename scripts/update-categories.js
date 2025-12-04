const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCategories() {
  try {
    console.log('🗑️  Clearing existing categories...');
    
    // Delete all existing categories (cascade will handle related data)
    await prisma.category.deleteMany({});
    
    console.log('✅ Existing categories cleared\n');
    console.log('🌱 Creating new categories...\n');

    // New category structure
    const categories = [
      {
        name: 'Baby & Infant Toys',
        slug: 'baby-infant-toys',
        description: 'Toys designed for babies and infants',
        subcategories: ['Rattles, teethers, soft toys, musical cot toys']
      },
      {
        name: 'Preschool & Learning Toys',
        slug: 'preschool-learning-toys',
        description: 'Educational toys for preschool children',
        subcategories: ['Alphabet toys, number boards, shape sorters, Montessori toys']
      },
      {
        name: 'Building & Construction Toys',
        slug: 'building-construction-toys',
        description: 'Building blocks and construction sets',
        subcategories: ['Lego-type blocks, magnetic tiles, engineering sets']
      },
      {
        name: 'Action Figures & Superheroes',
        slug: 'action-figures-superheroes',
        description: 'Action figures and superhero toys',
        subcategories: ['Marvel, DC, anime characters, Indian cartoon characters']
      },
      {
        name: 'Dolls & Doll Accessories',
        slug: 'dolls-doll-accessories',
        description: 'Dolls and accessories',
        subcategories: ['Fashion dolls, baby dolls, doll houses, doll furniture']
      },
      {
        name: 'Outdoor & Sports Toys',
        slug: 'outdoor-sports-toys',
        description: 'Outdoor games and sports equipment',
        subcategories: ['Cricket sets, footballs, badminton sets, skipping ropes']
      },
      {
        name: 'Ride-On Toys & Scooters',
        slug: 'ride-on-toys-scooters',
        description: 'Ride-on vehicles and scooters',
        subcategories: ['Scooty ride-ons, push cars, battery-operated vehicles']
      },
      {
        name: 'Remote Control & Battery Toys',
        slug: 'remote-control-battery-toys',
        description: 'RC and battery-operated toys',
        subcategories: ['RC cars, helicopters, robots, rechargeable vehicles']
      },
      {
        name: 'Board Games & Puzzles',
        slug: 'board-games-puzzles',
        description: 'Board games and puzzle sets',
        subcategories: ['Chess, ludo, snakes & ladders, jigsaw puzzles']
      },
      {
        name: 'Soft Toys & Plush',
        slug: 'soft-toys-plush',
        description: 'Soft toys and plush animals',
        subcategories: ['Teddy bears, cartoon plush dolls, animals']
      },
      {
        name: 'Electronic & STEM Toys',
        slug: 'electronic-stem-toys',
        description: 'Electronic and STEM learning toys',
        subcategories: ['Science kits, circuits, coding toys, robotics']
      },
      {
        name: 'Arts, Craft & DIY Sets',
        slug: 'arts-craft-diy-sets',
        description: 'Art and craft supplies',
        subcategories: ['Painting kits, clay, slime kits, jewellery-making sets']
      },
      {
        name: 'Kitchen & Role Play Toys',
        slug: 'kitchen-role-play-toys',
        description: 'Kitchen sets and role play toys',
        subcategories: ['Mini kitchen sets, doctor sets, mechanic sets']
      },
      {
        name: 'Musical Instruments for Kids',
        slug: 'musical-instruments-kids',
        description: 'Musical instruments for children',
        subcategories: ['Toy guitars, keyboards, drums, xylophones']
      },
      {
        name: 'Educational Books & Flash Cards',
        slug: 'educational-books-flash-cards',
        description: 'Educational books and learning materials',
        subcategories: ['Storybooks, activity books, learning flash cards']
      },
      {
        name: 'Party Favour Toys',
        slug: 'party-favour-toys',
        description: 'Party favours and return gifts',
        subcategories: ['Small cars, whistles, masks, return-gift sets']
      },
      {
        name: 'Vehicles & Pull-back Toys',
        slug: 'vehicles-pull-back-toys',
        description: 'Vehicle toys and pull-back toys',
        subcategories: ['Pull-back cars, trucks, buses, trains']
      },
      {
        name: 'Seasonal & Festival Toys',
        slug: 'seasonal-festival-toys',
        description: 'Festival and seasonal toys',
        subcategories: ['Diwali lights/toys, Christmas toys, Holi water guns']
      },
      {
        name: 'Water & Sand Play Toys',
        slug: 'water-sand-play-toys',
        description: 'Water and sand play equipment',
        subcategories: ['Water guns, beach sets, inflatable pools']
      },
      {
        name: 'Premium & Collector\'s Items',
        slug: 'premium-collectors-items',
        description: 'Premium toys and collector items',
        subcategories: ['Anime models, branded figures, display toys']
      }
    ];

    let displayOrder = 1;
    
    for (const category of categories) {
      // Create main category
      const mainCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          isActive: true,
          displayOrder: displayOrder++
        }
      });

      console.log(`✅ Created: ${category.name}`);

      // Create subcategory
      const subcategoryName = category.subcategories[0];
      const subcategorySlug = `${category.slug}-all`;
      
      await prisma.category.create({
        data: {
          name: subcategoryName,
          slug: subcategorySlug,
          description: subcategoryName,
          isActive: true,
          displayOrder: 1,
          parentId: mainCategory.id
        }
      });

      console.log(`   ↳ ${subcategoryName}\n`);
    }

    console.log('✨ All categories created successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Main Categories: ${categories.length}`);
    console.log(`   Subcategories: ${categories.length}`);
    console.log(`   Total: ${categories.length * 2}\n`);

  } catch (error) {
    console.error('❌ Error updating categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories()
  .then(() => {
    console.log('🎯 Category update completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
