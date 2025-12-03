'use client';

import { useParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';

const ageData: Record<string, { name: string; description: string; icon: string }> = {
  '0-1-years': { name: '0-1 Years', description: 'Safe products for newborns and infants', icon: '👶' },
  '1-2-years': { name: '1-2 Years', description: 'Perfect for toddlers exploring the world', icon: '🍼' },
  '2-4-years': { name: '2-4 Years', description: 'Engaging toys for preschoolers', icon: '🧒' },
  '4-6-years': { name: '4-6 Years', description: 'Educational products for early learners', icon: '👧' },
  '6-8-years': { name: '6-8 Years', description: 'Advanced learning and play items', icon: '🧑' },
  '8-plus-years': { name: '8+ Years', description: 'Challenging and fun products for older kids', icon: '👦' },
};

export default function AgeGroupPage() {
  const params = useParams();
  const slug = params.slug as string;
  const ageGroup = ageData[slug] || { name: 'Age Group', description: 'Products by age', icon: '👶' };

  const products = [
    {
      id: '1',
      name: 'Educational Learning Kit',
      slug: 'educational-learning-kit',
      price: 1299,
      originalPrice: 1999,
      image: '🔬',
      rating: 5,
      reviewCount: 24,
      isNew: true,
      discount: 35,
      inStock: true,
    },
    {
      id: '2',
      name: 'Building Blocks Set',
      slug: 'building-blocks-set',
      price: 799,
      originalPrice: 1299,
      image: '🧱',
      rating: 4,
      reviewCount: 18,
      discount: 38,
      inStock: true,
    },
    {
      id: '7',
      name: 'Story Books Collection',
      slug: 'story-books-collection',
      price: 1299,
      originalPrice: 1999,
      image: '📚',
      rating: 5,
      reviewCount: 45,
      discount: 35,
      inStock: true,
    },
    {
      id: '6',
      name: 'Puzzle Game Set',
      slug: 'puzzle-game-set',
      price: 599,
      originalPrice: 999,
      image: '🧩',
      rating: 4,
      reviewCount: 21,
      discount: 40,
      inStock: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container-custom text-center">
          <span className="text-7xl mb-4 block">{ageGroup.icon}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {ageGroup.name}
          </h1>
          <p className="text-xl text-gray-600">{ageGroup.description}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <p className="text-gray-600 mb-8">Showing {products.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
