import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import HeroCarousel from '@/components/home/HeroCarousel';
import Image from 'next/image';

// Force dynamic rendering to avoid build-time fetch issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHomeData() {
  try {
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

// Product card component
function ProductCard({ product }: { product: any }) {
  const discount = calculateDiscount(Number(product.price), product.compareAtPrice ? Number(product.compareAtPrice) : null);
  const image = product.images?.[0]?.url;
  
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    >
      <div className="relative aspect-square bg-gray-100">
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
            {discount}% OFF
          </div>
        )}
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
            <span className="text-sm text-gray-500 line-through">
              ₹{Number(product.compareAtPrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
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

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <section>
        <HeroCarousel />
      </section>

      {/* Premium Boutiques Section */}
      {featuredProducts.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">PREMIUM BOUTIQUES</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Featured Product Banners */}
              {featuredProducts.slice(0, 3).map((product: any, index: number) => {
                const discount = calculateDiscount(Number(product.price), product.compareAtPrice ? Number(product.compareAtPrice) : null);
                const bgColors = ['bg-gradient-to-br from-pink-100 to-pink-200', 'bg-gradient-to-br from-blue-100 to-blue-200', 'bg-gradient-to-br from-purple-100 to-purple-200'];
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={`${bgColors[index]} rounded-xl p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-64 flex flex-col justify-between`}
                  >
                    <div className="relative z-10">
                      <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        {discount > 0 ? `UPTO ${discount}% OFF` : 'SPECIAL OFFER'}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-700">Age: {product.ageGroup || 'All Ages'}</p>
                    </div>
                    <div className="relative z-10">
                      <button className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
                        SHOP NOW
                      </button>
                    </div>
                    {product.images?.[0]?.url && (
                      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
                        <Image
                          src={product.images[0].url}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Affordable Winter Must-haves / Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Affordable <span className="text-pink-600">Winter Must-haves!</span>
              </h2>
              <p className="text-gray-600">Snag the hottest deals of the season</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {saleProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-6">
              <Link 
                href="/products?sale=true"
                className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700"
              >
                View All Boutiques <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Winter Deals You Can't Miss */}
      {winterProducts.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Winter Deals <span className="text-pink-600">You Can't Miss!</span>
              </h2>
              <p className="text-gray-600">Get the trendiest cold-weather looks at great prices.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {winterProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasion Wear Section */}
      {(ethnicProducts.length > 0 || partyWearProducts.length > 0) && (
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Occasion <span className="text-pink-600">Wear</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Ethnic Wear Banner */}
              {ethnicProducts.length > 0 && (
                <div className="relative bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl overflow-hidden h-80">
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-block bg-white px-4 py-2 rounded-full mb-4">
                        <span className="text-pink-600 font-bold text-sm">ETHNIC WEAR</span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Envision Your Elegance</h3>
                      <p className="text-gray-800 mb-4">The Ultimate Wedding Fashion Guide</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">BUY 1 @ 40% OFF | BUY 2 @ 45% OFF</p>
                      <Link 
                        href="/categories/ethnic-wear"
                        className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                      >
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Party Wear Banner */}
              {partyWearProducts.length > 0 && (
                <div className="relative bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl overflow-hidden h-80">
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-block bg-white px-4 py-2 rounded-full mb-4">
                        <span className="text-purple-600 font-bold text-sm">PARTY WEAR</span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">Celebrate in Style</h3>
                      <p className="text-gray-800 mb-4">Perfect outfits for every celebration</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">BUY 1 @ 40% OFF | BUY 2 @ 45% OFF</p>
                      <Link 
                        href="/categories/party-wear"
                        className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                      >
                        SHOP NOW
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Occasion Wear Products Grid */}
            {(ethnicProducts.length > 0 || partyWearProducts.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...ethnicProducts.slice(0, 6), ...partyWearProducts.slice(0, 6)].slice(0, 12).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stride in Style - Categories Section */}
      {allCategories.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Stride in <span className="text-pink-600">Style</span>
              </h2>
              <p className="text-gray-600">Shop the sale!</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allCategories.slice(0, 12).map((category: any) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="mb-3">
                    {category.image ? (
                      <div className="relative w-full h-24 mb-2">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="text-4xl mb-2">{category.icon || '🛍️'}</div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Baby Diapers & More Section */}
      {babyProducts.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                BABY DIAPERS <span className="text-pink-600">& MORE</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {babyProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  New <span className="text-pink-600">Arrivals</span>
                </h2>
                <p className="text-gray-600">Discover the latest additions to our collection</p>
              </div>
              <Link 
                href="/new-arrivals"
                className="text-pink-600 font-semibold hover:text-pink-700 flex items-center"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {newArrivals.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  Trending <span className="text-pink-600">Now</span>
                </h2>
                <p className="text-gray-600">Most popular items this week</p>
              </div>
              <Link 
                href="/products?trending=true"
                className="text-pink-600 font-semibold hover:text-pink-700 flex items-center"
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Shop With Us */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why Shop With Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders above ₹999</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% safe & secure</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">7-day return policy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-sm text-gray-600">Tested & certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Join Our Newsletter</h2>
            <p className="mb-6">Get exclusive deals and updates directly to your inbox!</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
