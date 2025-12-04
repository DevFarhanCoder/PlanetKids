const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCategories() {
  try {
    console.log('🗑️  Clearing existing categories...');
    
    // Delete all existing categories
    await prisma.category.deleteMany({});
    
    console.log('✅ Existing categories cleared\n');
    console.log('🌱 Creating new categories...\n');

    // New category structure with multiple subcategories
    const categories = [
      {
        name: 'Baby & Infant Toys',
        slug: 'baby-infant-toys',
        description: 'Toys designed for babies and infants',
        subcategories: ['Rattles', 'Teethers', 'Soft Toys', 'Musical Cot Toys']
      },
      {
        name: 'Preschool & Learning Toys',
        slug: 'preschool-learning-toys',
        description: 'Educational toys for preschool children',
        subcategories: ['Alphabet Toys', 'Number Boards', 'Shape Sorters', 'Montessori Toys']
      },
      {
        name: 'Building & Construction Toys',
        slug: 'building-construction-toys',
        description: 'Building blocks and construction sets',
        subcategories: ['Lego-Type Blocks', 'Magnetic Tiles', 'Engineering Sets']
      },
      {
        name: 'Action Figures & Superheroes',
        slug: 'action-figures-superheroes',
        description: 'Action figures and superhero toys',
        subcategories: ['Marvel', 'DC', 'Anime Characters', 'Indian Cartoon Characters']
      },
      {
        name: 'Dolls & Doll Accessories',
        slug: 'dolls-doll-accessories',
        description: 'Dolls and accessories',
        subcategories: ['Fashion Dolls', 'Baby Dolls', 'Doll Houses', 'Doll Furniture']
      },
      {
        name: 'Outdoor & Sports Toys',
        slug: 'outdoor-sports-toys',
        description: 'Outdoor games and sports equipment',
        subcategories: ['Cricket Sets', 'Footballs', 'Badminton Sets', 'Skipping Ropes']
      },
      {
        name: 'Ride-On Toys & Scooters',
        slug: 'ride-on-toys-scooters',
        description: 'Ride-on toys and scooters',
        subcategories: ['Scooty Ride-Ons', 'Push Cars', 'Battery-Operated Vehicles']
      },
      {
        name: 'Remote Control & Battery Toys',
        slug: 'remote-control-battery-toys',
        description: 'Remote control and battery operated toys',
        subcategories: ['RC Cars', 'Helicopters', 'Robots', 'Rechargeable Vehicles']
      },
      {
        name: 'Board Games & Puzzles',
        slug: 'board-games-puzzles',
        description: 'Board games and jigsaw puzzles',
        subcategories: ['Chess', 'Ludo', 'Snakes & Ladders', 'Jigsaw Puzzles']
      },
      {
        name: 'Soft Toys & Plush',
        slug: 'soft-toys-plush',
        description: 'Soft and plush toys',
        subcategories: ['Teddy Bears', 'Cartoon Plush Dolls', 'Animals']
      },
      {
        name: 'Electronic & STEM Toys',
        slug: 'electronic-stem-toys',
        description: 'Electronic learning and STEM toys',
        subcategories: ['Science Kits', 'Circuits', 'Coding Toys', 'Robotics']
      },
      {
        name: 'Arts, Craft & DIY Sets',
        slug: 'arts-craft-diy-sets',
        description: 'Arts, crafts and DIY activity sets',
        subcategories: ['Painting Kits', 'Clay', 'Slime Kits', 'Jewellery-Making Sets']
      },
      {
        name: 'Kitchen & Role Play Toys',
        slug: 'kitchen-role-play-toys',
        description: 'Kitchen sets and role play toys',
        subcategories: ['Mini Kitchen Sets', 'Doctor Sets', 'Mechanic Sets']
      },
      {
        name: 'Musical Instruments for Kids',
        slug: 'musical-instruments-kids',
        description: 'Musical instruments for children',
        subcategories: ['Toy Guitars', 'Keyboards', 'Drums', 'Xylophones']
      },
      {
        name: 'Educational Books & Flash Cards',
        slug: 'educational-books-flash-cards',
        description: 'Educational books and learning flash cards',
        subcategories: ['Storybooks', 'Activity Books', 'Learning Flash Cards']
      },
      {
        name: 'Party Favour Toys',
        slug: 'party-favour-toys',
        description: 'Small toys perfect for party favours',
        subcategories: ['Small Cars', 'Whistles', 'Masks', 'Return-Gift Sets']
      },
      {
        name: 'Vehicles & Pull-Back Toys',
        slug: 'vehicles-pull-back-toys',
        description: 'Vehicle toys and pull-back toys',
        subcategories: ['Pull-Back Cars', 'Trucks', 'Buses', 'Trains']
      },
      {
        name: 'Seasonal & Festival Toys',
        slug: 'seasonal-festival-toys',
        description: 'Toys for festivals and seasonal celebrations',
        subcategories: ['Diwali Lights/Toys', 'Christmas Toys', 'Holi Water Guns']
      },
      {
        name: 'Water & Sand Play Toys',
        slug: 'water-sand-play-toys',
        description: 'Water and sand play toys',
        subcategories: ['Water Guns', 'Beach Sets', 'Inflatable Pools']
      },
      {
        name: 'Premium & Collector\'s Items',
        slug: 'premium-collectors-items',
        description: 'Premium and collectible toys',
        subcategories: ['Anime Models', 'Branded Figures', 'Display Toys']
      }
    ];

    let totalSubcategories = 0;

    // Create categories with subcategories
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      
      // Create main category
      const mainCategory = await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          displayOrder: i + 1,
          isActive: true,
        }
      });

      console.log(`✅ Created: ${cat.name}`);

      // Create subcategories
      for (let j = 0; j < cat.subcategories.length; j++) {
        const subName = cat.subcategories[j];
        const subSlug = `${cat.slug}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        
        await prisma.category.create({
          data: {
            name: subName,
            slug: subSlug,
            description: `${subName} in ${cat.name}`,
            parentId: mainCategory.id,
            displayOrder: j + 1,
            isActive: true,
          }
        });

        console.log(`   ↳ ${subName}`);
        totalSubcategories++;
      }

      console.log('');
    }

    console.log('✨ All categories created successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Main Categories: ${categories.length}`);
    console.log(`   Subcategories: ${totalSubcategories}`);
    console.log(`   Total: ${categories.length + totalSubcategories}\n`);
    console.log('🎯 Category update completed!');

  } catch (error) {
    console.error('❌ Error updating categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateCategories()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
