const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupToyCategories() {
  try {
    console.log('🧸 Setting up Toy Categories...\n');

    // Delete all existing categories
    console.log('Deleting existing categories...');
    await prisma.category.deleteMany({});
    console.log('✓ Existing categories deleted\n');

    // Create categories with parent-child relationships
    const categoriesData = [
      {
        name: 'Baby & Infant Toys',
        slug: 'baby-infant-toys',
        icon: '🍼',
        children: [
          { name: 'Rattles', slug: 'rattles', icon: '🔔' },
          { name: 'Teethers', slug: 'teethers', icon: '🦷' },
          { name: 'Soft Toys', slug: 'baby-soft-toys', icon: '🧸' },
          { name: 'Musical Cot Toys', slug: 'musical-cot-toys', icon: '🎵' }
        ]
      },
      {
        name: 'Preschool & Learning Toys',
        slug: 'preschool-learning-toys',
        icon: '📚',
        children: [
          { name: 'Alphabet Toys', slug: 'alphabet-toys', icon: '🔤' },
          { name: 'Number Boards', slug: 'number-boards', icon: '🔢' },
          { name: 'Shape Sorters', slug: 'shape-sorters', icon: '🔷' },
          { name: 'Montessori Toys', slug: 'montessori-toys', icon: '🎓' }
        ]
      },
      {
        name: 'Building & Construction Toys',
        slug: 'building-construction-toys',
        icon: '🏗️',
        children: [
          { name: 'Lego-type Blocks', slug: 'lego-blocks', icon: '🧱' },
          { name: 'Magnetic Tiles', slug: 'magnetic-tiles', icon: '🧲' },
          { name: 'Engineering Sets', slug: 'engineering-sets', icon: '⚙️' }
        ]
      },
      {
        name: 'Action Figures & Superheroes',
        slug: 'action-figures-superheroes',
        icon: '🦸',
        children: [
          { name: 'Marvel Heroes', slug: 'marvel-heroes', icon: '🦸‍♂️' },
          { name: 'DC Heroes', slug: 'dc-heroes', icon: '🦇' },
          { name: 'Anime Characters', slug: 'anime-characters', icon: '⚡' },
          { name: 'Indian Cartoon Characters', slug: 'indian-cartoon-characters', icon: '🎭' }
        ]
      },
      {
        name: 'Dolls & Doll Accessories',
        slug: 'dolls-doll-accessories',
        icon: '👧',
        children: [
          { name: 'Fashion Dolls', slug: 'fashion-dolls', icon: '💃' },
          { name: 'Baby Dolls', slug: 'baby-dolls', icon: '👶' },
          { name: 'Doll Houses', slug: 'doll-houses', icon: '🏠' },
          { name: 'Doll Furniture', slug: 'doll-furniture', icon: '🛋️' }
        ]
      },
      {
        name: 'Outdoor & Sports Toys',
        slug: 'outdoor-sports-toys',
        icon: '⚽',
        children: [
          { name: 'Cricket Sets', slug: 'cricket-sets', icon: '🏏' },
          { name: 'Footballs', slug: 'footballs', icon: '⚽' },
          { name: 'Badminton Sets', slug: 'badminton-sets', icon: '🏸' },
          { name: 'Skipping Ropes', slug: 'skipping-ropes', icon: '🪢' }
        ]
      },
      {
        name: 'Ride-On Toys & Scooters',
        slug: 'ride-on-toys-scooters',
        icon: '🛴',
        children: [
          { name: 'Scooty Ride-ons', slug: 'scooty-ride-ons', icon: '🛵' },
          { name: 'Push Cars', slug: 'push-cars', icon: '🚗' },
          { name: 'Battery-operated Vehicles', slug: 'battery-vehicles', icon: '🔋' }
        ]
      },
      {
        name: 'Remote Control & Battery Toys',
        slug: 'remote-control-battery-toys',
        icon: '🎮',
        children: [
          { name: 'RC Cars', slug: 'rc-cars', icon: '🏎️' },
          { name: 'RC Helicopters', slug: 'rc-helicopters', icon: '🚁' },
          { name: 'RC Robots', slug: 'rc-robots', icon: '🤖' },
          { name: 'Rechargeable Vehicles', slug: 'rechargeable-vehicles', icon: '🔌' }
        ]
      },
      {
        name: 'Board Games & Puzzles',
        slug: 'board-games-puzzles',
        icon: '🎲',
        children: [
          { name: 'Chess', slug: 'chess', icon: '♟️' },
          { name: 'Ludo', slug: 'ludo', icon: '🎲' },
          { name: 'Snakes & Ladders', slug: 'snakes-ladders', icon: '🐍' },
          { name: 'Jigsaw Puzzles', slug: 'jigsaw-puzzles', icon: '🧩' }
        ]
      },
      {
        name: 'Soft Toys & Plush',
        slug: 'soft-toys-plush',
        icon: '🧸',
        children: [
          { name: 'Teddy Bears', slug: 'teddy-bears', icon: '🐻' },
          { name: 'Cartoon Plush Dolls', slug: 'cartoon-plush-dolls', icon: '🦄' },
          { name: 'Animal Plush', slug: 'animal-plush', icon: '🐶' }
        ]
      },
      {
        name: 'Electronic & STEM Toys',
        slug: 'electronic-stem-toys',
        icon: '🔬',
        children: [
          { name: 'Science Kits', slug: 'science-kits', icon: '⚗️' },
          { name: 'Circuit Toys', slug: 'circuit-toys', icon: '💡' },
          { name: 'Coding Toys', slug: 'coding-toys', icon: '💻' },
          { name: 'Robotics Kits', slug: 'robotics-kits', icon: '🤖' }
        ]
      },
      {
        name: 'Arts, Craft & DIY Sets',
        slug: 'arts-craft-diy-sets',
        icon: '🎨',
        children: [
          { name: 'Painting Kits', slug: 'painting-kits', icon: '🖌️' },
          { name: 'Clay & Modeling', slug: 'clay-modeling', icon: '🏺' },
          { name: 'Slime Kits', slug: 'slime-kits', icon: '🌈' },
          { name: 'Jewellery-making Sets', slug: 'jewellery-making-sets', icon: '💍' }
        ]
      },
      {
        name: 'Kitchen & Role Play Toys',
        slug: 'kitchen-role-play-toys',
        icon: '👨‍🍳',
        children: [
          { name: 'Mini Kitchen Sets', slug: 'mini-kitchen-sets', icon: '🍳' },
          { name: 'Doctor Sets', slug: 'doctor-sets', icon: '👨‍⚕️' },
          { name: 'Mechanic Sets', slug: 'mechanic-sets', icon: '🔧' }
        ]
      },
      {
        name: 'Musical Instruments for Kids',
        slug: 'musical-instruments-kids',
        icon: '🎸',
        children: [
          { name: 'Toy Guitars', slug: 'toy-guitars', icon: '🎸' },
          { name: 'Toy Keyboards', slug: 'toy-keyboards', icon: '🎹' },
          { name: 'Toy Drums', slug: 'toy-drums', icon: '🥁' },
          { name: 'Xylophones', slug: 'xylophones', icon: '🎵' }
        ]
      },
      {
        name: 'Educational Books & Flash Cards',
        slug: 'educational-books-flash-cards',
        icon: '📖',
        children: [
          { name: 'Storybooks', slug: 'storybooks', icon: '📚' },
          { name: 'Activity Books', slug: 'activity-books', icon: '✏️' },
          { name: 'Learning Flash Cards', slug: 'learning-flash-cards', icon: '🃏' }
        ]
      },
      {
        name: 'Party Favour Toys',
        slug: 'party-favour-toys',
        icon: '🎉',
        children: [
          { name: 'Small Cars', slug: 'small-cars', icon: '🚗' },
          { name: 'Whistles', slug: 'whistles', icon: '🎺' },
          { name: 'Masks', slug: 'masks', icon: '🎭' },
          { name: 'Return-gift Sets', slug: 'return-gift-sets', icon: '🎁' }
        ]
      },
      {
        name: 'Vehicles & Pull-back Toys',
        slug: 'vehicles-pull-back-toys',
        icon: '🚗',
        children: [
          { name: 'Pull-back Cars', slug: 'pull-back-cars', icon: '🏎️' },
          { name: 'Pull-back Trucks', slug: 'pull-back-trucks', icon: '🚚' },
          { name: 'Pull-back Buses', slug: 'pull-back-buses', icon: '🚌' },
          { name: 'Pull-back Trains', slug: 'pull-back-trains', icon: '🚂' }
        ]
      },
      {
        name: 'Seasonal & Festival Toys',
        slug: 'seasonal-festival-toys',
        icon: '🎊',
        children: [
          { name: 'Diwali Lights & Toys', slug: 'diwali-lights-toys', icon: '🪔' },
          { name: 'Christmas Toys', slug: 'christmas-toys', icon: '🎄' },
          { name: 'Holi Water Guns', slug: 'holi-water-guns', icon: '💦' }
        ]
      },
      {
        name: 'Water & Sand Play Toys',
        slug: 'water-sand-play-toys',
        icon: '🏖️',
        children: [
          { name: 'Water Guns', slug: 'water-guns', icon: '🔫' },
          { name: 'Beach Sets', slug: 'beach-sets', icon: '⛱️' },
          { name: 'Inflatable Pools', slug: 'inflatable-pools', icon: '🏊' }
        ]
      },
      {
        name: 'Premium & Collector\'s Items',
        slug: 'premium-collectors-items',
        icon: '⭐',
        children: [
          { name: 'Anime Models', slug: 'anime-models', icon: '🎌' },
          { name: 'Branded Figures', slug: 'branded-figures', icon: '🏆' },
          { name: 'Display Toys', slug: 'display-toys', icon: '🖼️' }
        ]
      }
    ];

    let displayOrder = 1;
    
    for (const categoryData of categoriesData) {
      console.log(`Creating: ${categoryData.name}`);
      
      // Create parent category
      const parent = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          icon: categoryData.icon,
          isActive: true,
          displayOrder: displayOrder++
        }
      });
      
      console.log(`  ✓ Parent: ${parent.name}`);
      
      // Create child categories
      for (const child of categoryData.children) {
        const childCategory = await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            icon: child.icon,
            parentId: parent.id,
            isActive: true,
            displayOrder: displayOrder++
          }
        });
        console.log(`    ✓ ${childCategory.name}`);
      }
      
      console.log('');
    }

    // Count results
    const totalCategories = await prisma.category.count();
    const parentCategories = await prisma.category.count({
      where: { parentId: null }
    });
    const childCategories = await prisma.category.count({
      where: { parentId: { not: null } }
    });

    console.log('✅ Toy Categories Setup Complete!\n');
    console.log(`Total Categories: ${totalCategories}`);
    console.log(`Parent Categories: ${parentCategories}`);
    console.log(`Sub-categories: ${childCategories}`);

  } catch (error) {
    console.error('❌ Error setting up categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupToyCategories();
