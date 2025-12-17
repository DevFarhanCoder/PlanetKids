import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';
import HeroCarousel from '@/components/home/HeroCarousel';
import Image from 'next/image';

// Force dynamic rendering to avoid build-time fetch issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHomeData() {
  try {
    // Use Vercel URL in production, localhost in development
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    
    const res = await fetch(`${baseUrl}/api/home`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.data || {};
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {};
  }
}

// Helper function to calculate discount percentage
function calculateDiscount(price: number, comparePrice: number | null): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export default async function Home() {
  const homeData = await getHomeData();
  
  const {
    featuredCategories = [],
    allCategories = [],
    featuredProducts = [],
    saleProducts = [],
    newArrivals = [],
    trendingProducts = [],
    babyProducts = [],
    winterProducts = [],
    ethnicProducts = [],
    partyWearProducts = [],
  } = homeData;

  // Hardcoded age groups data
  const ageGroups = [
    { slug: '0-12-months', name: '0-12 Months', image: '👶' },
    { slug: '1-2-years', name: '1-2 Years', image: '🍼' },
    { slug: '3-4-years', name: '3-4 Years', image: '🎈' },
    { slug: '5-6-years', name: '5-6 Years', image: '🎨' },
    { slug: '7-8-years', name: '7-8 Years', image: '⚽' },
    { slug: '9-plus', name: '9+ Years', image: '🎮' },
  ];

  // Hardcoded price ranges data
  const priceRanges = [
    { slug: 'under-500', name: 'Under ₹500' },
    { slug: '500-1000', name: '₹500 - ₹1000' },
    { slug: '1000-2000', name: '₹1000 - ₹2000' },
    { slug: '2000-3000', name: '₹2000 - ₹3000' },
    { slug: '3000-5000', name: '₹3000 - ₹5000' },
    { slug: 'above-5000', name: 'Above ₹5000' },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Quick Links Banner */}
      <section className="py-6 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/new-arrivals" className="flex items-center justify-center gap-3 bg-white rounded-lg p-4 hover:shadow-md transition-shadow group">
              <div className="text-3xl">🎉</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary">New Arrivals</h3>
                <p className="text-xs text-gray-500">Latest Toys</p>
              </div>
            </Link>
            <Link href="/categories/toys-and-games" className="flex items-center justify-center gap-3 bg-white rounded-lg p-4 hover:shadow-md transition-shadow group">
              <div className="text-3xl">🧸</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary">Toys & Games</h3>
                <p className="text-xs text-gray-500">Play Time</p>
              </div>
            </Link>
            <Link href="/categories/school-essentials" className="flex items-center justify-center gap-3 bg-white rounded-lg p-4 hover:shadow-md transition-shadow group">
              <div className="text-3xl">🎓</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary">School Needs</h3>
                <p className="text-xs text-gray-500">Study Gear</p>
              </div>
            </Link>
            <Link href="/categories/baby-essentials" className="flex items-center justify-center gap-3 bg-white rounded-lg p-4 hover:shadow-md transition-shadow group">
              <div className="text-3xl">👶</div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary">Baby Care</h3>
                <p className="text-xs text-gray-500">0-2 Years</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Shop by Category</h2>
              <p className="text-gray-500 text-sm">Explore our diverse collection</p>
            </div>
            <Link href="/products" className="text-primary font-semibold hover:text-primary-600 flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {allCategories.map((category: any, index: number) => {
              const gradients = [
                'from-pink-400 to-pink-600',
                'from-blue-400 to-blue-600',
                'from-purple-400 to-purple-600',
                'from-yellow-400 to-yellow-600',
                'from-green-400 to-green-600',
                'from-red-400 to-red-600',
                'from-indigo-400 to-indigo-600',
                'from-orange-400 to-orange-600'
              ];
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className={`relative overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 group hover:scale-105`}
                >
                  <div className="relative z-10">
                    <div className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                    <h3 className="font-bold text-white text-base md:text-lg drop-shadow-lg">{category.name}</h3>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">✨ Featured Products</h2>
              <p className="text-gray-500 text-sm">Handpicked favorites for your little ones</p>
            </div>
            <Link href="/new-arrivals" className="text-primary font-semibold hover:text-primary-600 flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 8).map((product: any) => {
                const discount = product.comparePrice && product.comparePrice > product.price
                  ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                  : 0;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                          {discount}% OFF
                        </div>
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                          ⭐ NEW
                        </div>
                      )}
                      {product.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl">🎁</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(0)</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg md:text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-xs md:text-sm text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg">No products available yet</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for amazing products!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop by Age Group */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">🎂 Shop by Age</h2>
            <p className="text-gray-500 text-sm">Age-appropriate products for every milestone</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {ageGroups.map((age: any, index: number) => {
              const colors = [
                'from-pink-100 to-pink-200 border-pink-300',
                'from-blue-100 to-blue-200 border-blue-300',
                'from-purple-100 to-purple-200 border-purple-300',
                'from-green-100 to-green-200 border-green-300',
                'from-yellow-100 to-yellow-200 border-yellow-300',
                'from-orange-100 to-orange-200 border-orange-300'
              ];
              return (
                <Link
                  key={age.slug}
                  href={`/age/${age.slug}`}
                  className={`bg-gradient-to-br ${colors[index]} border-2 p-4 md:p-6 rounded-2xl hover:shadow-xl transition-all duration-300 text-center group hover:scale-105`}
                >
                  <div className="text-3xl md:text-5xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">{age.image}</div>
                  <h3 className="font-bold text-gray-900 text-xs md:text-sm">{age.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop by Price */}
      <section className="py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">💰 Budget-Friendly Picks</h2>
            <p className="text-gray-500 text-sm">Quality products at every price point</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {priceRanges.map((range: any, index: number) => {
              const bgColors = [
                'bg-gradient-to-br from-blue-500 to-blue-600',
                'bg-gradient-to-br from-green-500 to-green-600',
                'bg-gradient-to-br from-purple-500 to-purple-600',
                'bg-gradient-to-br from-pink-500 to-pink-600',
                'bg-gradient-to-br from-orange-500 to-orange-600',
                'bg-gradient-to-br from-red-500 to-red-600'
              ];
              return (
                <Link
                  key={range.slug}
                  href={`/price/${range.slug}`}
                  className={`${bgColors[index]} text-white p-5 md:p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center group hover:scale-105 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <h3 className="font-bold text-sm md:text-base relative z-10">{range.name}</h3>
                  <p className="text-xs opacity-90 mt-1 relative z-10">Great Deals</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">🌟 Why PlanetKids?</h2>
            <p className="text-gray-500 text-sm">Your trusted partner in parenting</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border-2 border-green-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">Free Shipping</h3>
              <p className="text-gray-600 text-xs md:text-sm">On orders above ₹999</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border-2 border-blue-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">100% Secure</h3>
              <p className="text-gray-600 text-xs md:text-sm">Safe payment gateway</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border-2 border-purple-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-4xl">🔄</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">Easy Returns</h3>
              <p className="text-gray-600 text-xs md:text-sm">7-day return policy</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 text-center border-2 border-yellow-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-4xl">⭐</span>
              </div>
              <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 text-xs md:text-sm">Tested & certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">📬 Join Our Newsletter</h2>
            <p className="mb-6 text-sm md:text-base opacity-90">Get exclusive deals, parenting tips, and product updates directly in your inbox!</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
