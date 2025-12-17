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
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border border-gray-100 hover:border-pink-200 cursor-pointer"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
            {discount}% OFF
          </div>
        )}
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            No Image
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors duration-300 min-h-[40px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base md:text-lg font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
            <span className="text-xs md:text-sm text-gray-500 line-through">
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
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">PREMIUM BOUTIQUES</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Large Featured Product Banners */}
              {featuredProducts.slice(0, 3).map((product: any, index: number) => {
                const discount = calculateDiscount(Number(product.price), product.compareAtPrice ? Number(product.compareAtPrice) : null);
                const titles = ['Mom Of All Sales', 'Unwrap The Joy Of Christmas', 'Envision Your Elegance'];
                const subtitles = ['Up To 14 Years', 'Launching Christmas Collection', 'The Ultimate Wedding Fashion Guide'];
                const taglines = ['SHOP NOW', 'Explore Now', 'Flat 40% Off'];
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
                  >
                    {/* Background Image */}
                    {product.images?.[0]?.url ? (
                      <div className="absolute inset-0">
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600"></div>
                    )}
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                      {/* Top Badge */}
                      <div className="flex justify-between items-start">
                        <div className="inline-flex items-center justify-center bg-red-600 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                          <div className="text-center">
                            <div className="text-xs md:text-sm font-bold">MOM OF ALL</div>
                            <div className="text-xs md:text-sm font-bold">SALES</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Content */}
                      <div className="relative z-10">
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                          {titles[index]}
                        </h3>
                        <p className="text-white text-sm md:text-base mb-4 opacity-90">{subtitles[index]}</p>
                        <div className="flex items-center gap-4">
                          <div className="inline-block bg-red-700 text-white px-6 py-3 rounded-full font-bold text-lg md:text-2xl shadow-lg">
                            FLAT {discount > 0 ? discount : 40}% OFF
                          </div>
                          <div className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm group-hover:bg-gray-100 transition-colors shadow-lg">
                            {taglines[index]} →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Second Row - 3 More Boutique Cards */}
            {featuredProducts.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {featuredProducts.slice(3, 6).map((product: any) => {
                  const discount = calculateDiscount(Number(product.price), product.compareAtPrice ? Number(product.compareAtPrice) : null);
                  const image = product.images?.[0]?.url;
                  
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="relative rounded-2xl overflow-hidden h-[280px] md:h-[350px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer bg-white"
                    >
                      {/* Image */}
                      {image ? (
                        <div className="absolute inset-0">
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-400"></div>
                      )}
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="self-end">
                            <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                              Upto {discount}% Off
                            </div>
                          </div>
                        )}
                        
                        {/* Bottom Info */}
                        <div className="relative z-10">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="inline-block bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm group-hover:bg-gray-100 transition-colors shadow-lg">
                            Explore Now
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Full Width View All Button */}
            <div className="text-center">
              <Link
                href="/products?featured=true"
                className="inline-flex items-center justify-center w-full md:w-auto min-w-[300px] bg-white border-2 border-pink-600 text-pink-600 px-12 py-4 rounded-full text-lg font-bold hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl group"
              >
                View All Boutiques
                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Affordable Winter Must-haves / Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Affordable <span className="text-pink-600">Winter Must-haves!</span>
              </h2>
              <p className="text-gray-600 text-lg">Snag the hottest deals of the season</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Winter Deals <span className="text-pink-600">You Can't Miss!</span>
              </h2>
              <p className="text-gray-600 text-lg">Get the trendiest cold-weather looks at great prices.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {winterProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasion Wear Section */}
      {(ethnicProducts.length > 0 || partyWearProducts.length > 0) && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Occasion <span className="text-pink-600">Wear</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Ethnic Wear Banner - Large Card */}
              {ethnicProducts.length > 0 && (
                <Link
                  href="/categories/ethnic-wear"
                  className="relative rounded-2xl overflow-hidden h-[400px] md:h-[450px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
                >
                  {ethnicProducts[0]?.images?.[0]?.url ? (
                    <div className="absolute inset-0">
                      <Image
                        src={ethnicProducts[0].images[0].url}
                        alt="Ethnic Wear"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500">
                      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Top Badge */}
                    <div className="inline-flex items-center">
                      <div className="relative">
                        <div className="bg-pink-600 text-white px-6 py-3 rounded-full shadow-xl">
                          <span className="font-bold text-lg">The Wedding Store</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Content */}
                    <div className="relative z-10">
                      <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl" style={{fontFamily: 'Georgia, serif'}}>
                        Envision<br />
                        <span className="italic">Your Elegance</span>
                      </h3>
                      <p className="text-white text-base md:text-lg mb-4 drop-shadow-lg">The Ultimate Wedding Fashion Guide</p>
                      <div className="flex flex-col gap-3">
                        <div className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                          Flat <span className="text-yellow-300">40</span>% Off
                        </div>
                        <div className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-base group-hover:bg-yellow-300 transition-colors shadow-xl w-fit">
                          SHOP NOW →
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute bottom-8 right-8 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                      🦢
                    </div>
                  </div>
                </Link>
              )}

              {/* Party Wear Banner - Large Card */}
              {partyWearProducts.length > 0 && (
                <Link
                  href="/categories/party-wear"
                  className="relative rounded-2xl overflow-hidden h-[400px] md:h-[450px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
                >
                  {partyWearProducts[0]?.images?.[0]?.url ? (
                    <div className="absolute inset-0">
                      <Image
                        src={partyWearProducts[0].images[0].url}
                        alt="Party Wear"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-orange-500">
                      <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)'}}></div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Top Badge */}
                    <div className="inline-flex items-center">
                      <div className="relative">
                        <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-xl animate-pulse">
                          <span className="font-bold text-lg">🎄 Christmas Special</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Content */}
                    <div className="relative z-10">
                      <div className="mb-3 inline-block">
                        <div className="text-white text-sm font-semibold mb-2">Launching Christmas Collection</div>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl" style={{fontFamily: 'Georgia, serif'}}>
                        Unwrap The Joy Of<br />
                        <span className="text-yellow-300 italic">Christmas</span>
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="inline-block bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-2xl shadow-xl w-fit">
                          FLAT <span className="text-5xl">40</span><span className="text-3xl">%</span> OFF
                        </div>
                        <div className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-bold text-base group-hover:bg-yellow-300 group-hover:text-gray-900 transition-colors shadow-xl w-fit">
                          Explore Now →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Stride in <span className="text-pink-600">Style</span>
              </h2>
              <p className="text-gray-600 text-lg">Shop the sale!</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {allCategories.slice(0, 12).map((category: any) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 text-center group border-2 border-gray-200 hover:border-pink-300 cursor-pointer overflow-hidden"
                >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Lock Icon Badge */}
                  <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg group-hover:bg-pink-500 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="mb-4">
                      {category.image ? (
                        <div className="relative w-full h-28 md:h-32 mb-3">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="text-5xl md:text-6xl mb-3 group-hover:scale-125 transition-transform duration-500">
                          {category.icon || '🛍️'}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Baby Diapers & More Section */}
      {babyProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                BABY DIAPERS <span className="text-pink-600">& MORE</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {babyProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  New <span className="text-pink-600">Arrivals</span>
                </h2>
                <p className="text-gray-600 text-lg">Discover the latest additions to our collection</p>
              </div>
              <Link 
                href="/new-arrivals"
                className="hidden md:flex items-center text-pink-600 font-bold hover:text-pink-700 text-lg group"
              >
                View All <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {newArrivals.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Trending <span className="text-pink-600">Now</span>
                </h2>
                <p className="text-gray-600 text-lg">Most popular items this week</p>
              </div>
              <Link 
                href="/products?trending=true"
                className="hidden md:flex items-center text-pink-600 font-bold hover:text-pink-700 text-lg group"
              >
                View All <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
