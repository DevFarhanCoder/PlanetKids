import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import HeroCarousel from '@/components/home/HeroCarousel';
import Image from 'next/image';

// Force dynamic rendering to avoid build-time fetch issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategories() {
  try {
    // Use Vercel URL in production, localhost in development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    
    const res = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getProducts() {
  try {
    // Use Vercel URL in production, localhost in development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    
    const res = await fetch(`${baseUrl}/api/products?limit=8&featured=true`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const dbCategories = await getCategories();
  const products = await getProducts();
  
  const categoryColors = ['bg-blue-100', 'bg-pink-100', 'bg-purple-100', 'bg-yellow-100', 'bg-green-100', 'bg-indigo-100', 'bg-red-100', 'bg-orange-100'];
  const categoryIcons = ['🎒', '🧸', '🎨', '🎁', '👶', '📚', '🎒', '✏️'];
  
  interface Category {
    name: string;
    slug: string;
    icon: string;
    color: string;
  }

  const categories: Category[] = dbCategories.length > 0 
    ? dbCategories.map((cat: any, index: number) => ({
        name: cat.name,
        slug: cat.slug,
        icon: categoryIcons[index % categoryIcons.length],
        color: categoryColors[index % categoryColors.length]
      }))
    : [
        { name: 'School Essentials', icon: '🎒', slug: 'school-essentials', color: 'bg-blue-100' },
        { name: 'Toys and Games', icon: '🧸', slug: 'toys-and-games', color: 'bg-pink-100' },
        { name: 'Art & Craft', icon: '🎨', slug: 'art-craft', color: 'bg-purple-100' },
        { name: 'Hampers', icon: '🎁', slug: 'hampers', color: 'bg-yellow-100' },
      ];

  const ageGroups = [
    { name: '0-1 Years', slug: '0-1-years', image: '👶' },
    { name: '1-2 Years', slug: '1-2-years', image: '🍼' },
    { name: '2-4 Years', slug: '2-4-years', image: '🧒' },
    { name: '4-6 Years', slug: '4-6-years', image: '👧' },
    { name: '6-8 Years', slug: '6-8-years', image: '🧑' },
    { name: '8+ Years', slug: '8-plus-years', image: '👦' },
  ];

  const priceRanges = [
    { name: 'Under ₹199', slug: 'under-199' },
    { name: 'Under ₹399', slug: 'under-399' },
    { name: 'Under ₹699', slug: 'under-699' },
    { name: 'Under ₹999', slug: 'under-999' },
    { name: 'Under ₹1499', slug: 'under-1499' },
    { name: 'Above ₹1500', slug: 'above-1500' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Browse our wide range of products for your little ones</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`${category.color} p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-bold text-gray-900">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h2>
              <p className="text-gray-600">Check out our latest products</p>
            </div>
            <Link href="/new-arrivals" className="text-primary font-semibold hover:text-primary-600 flex items-center gap-2">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.slice(0, 8).map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="product-card group">
                  <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 badge-new">NEW</div>
                    )}
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        🎁
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500">(0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <>
                          <span className="text-sm text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
                          <span className="badge-sale">
                            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products yet. Add your first product from the admin panel!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop by Age Group */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Age</h2>
            <p className="text-gray-600">Find age-appropriate products for your child</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ageGroups.map((age) => (
              <Link
                key={age.slug}
                href={`/age/${age.slug}`}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl hover:shadow-lg transition-all duration-300 text-center group hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{age.image}</div>
                <h3 className="font-bold text-gray-900">{age.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Price */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Price</h2>
            <p className="text-gray-600">Find products that fit your budget</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {priceRanges.map((range) => (
              <Link
                key={range.slug}
                href={`/price/${range.slug}`}
                className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 text-center group"
              >
                <h3 className="font-bold text-primary group-hover:text-primary-600">{range.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Shop with PlanetKids?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">On prepaid orders above ₹999</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">7-day hassle-free returns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">Verified & tested products</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
