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

  // Category data for sections
  const premiumBoutiques = [
    {
      title: "Mom Of All Sale I Up To 14 Y",
      subtitle: "Upto 60% Off",
      badge: "MOM OF ALL SALES",
      bgColor: "from-pink-400 to-pink-600",
      href: "/products?age=0-14"
    },
    {
      title: "Unwrap The Joy Of Christmas",
      subtitle: "Explore Now",
      badge: "CHRISTMAS SPECIAL",
      bgColor: "from-red-500 to-red-700",
      href: "/products?category=christmas"
    },
    {
      title: "Envision Your Elegance",
      subtitle: "Flat 40% Off",
      badge: "THE WEDDING STORE",
      bgColor: "from-emerald-400 to-emerald-600",
      href: "/products?category=wedding"
    }
  ];

  const winterCategories = [
    { name: "Hoodies", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_16.jpg", href: "/products?category=hoodies" },
    { name: "Sweatshirts", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_17.jpg", href: "/products?category=sweatshirts" },
    { name: "Winter Sets", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_18.jpg", href: "/products?category=winter-sets" },
    { name: "Pullovers", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_19.jpg", href: "/products?category=pullovers" },
    { name: "Jackets", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_20.jpg", href: "/products?category=jackets" },
    { name: "Coats", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_21.jpg", href: "/products?category=coats" },
    { name: "Sweaters", discount: "50", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_22.jpg", href: "/products?category=sweaters" },
    { name: "Winter Accessories", discount: "60", image: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_23.jpg", href: "/products?category=accessories" }
  ];

  const babyCategories = [
    { name: "Baby Diapers", icon: "🍼", href: "/products?category=diapers" },
    { name: "Baby Wipes", icon: "🧻", href: "/products?category=wipes" },
    { name: "Cloth Diapers & Nappies", icon: "👶", href: "/products?category=cloth-diapers" },
    { name: "Diaper Rash Cream", icon: "🧴", href: "/products?category=rash-cream" },
    { name: "Diaper Changing Pads & Mats", icon: "📋", href: "/products?category=changing-pads" },
    { name: "Diaper Bag", icon: "🎒", href: "/products?category=diaper-bags" },
    { name: "Potty Training", icon: "🚽", href: "/products?category=potty-training" }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <section>
        <HeroCarousel />
      </section>

      {/* Premium Boutiques Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">PREMIUM BOUTIQUES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumBoutiques.map((boutique, index) => {
              const boutiqueImages = [
                'https://cdn.fcglcdn.com/brainbees/images/boutique/670x670/38293.webp',
                'https://cdn.fcglcdn.com/brainbees/images/boutique/670x670/38171.webp',
                'https://cdn.fcglcdn.com/brainbees/images/boutique/670x670/38147.webp'
              ];
              
              return (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  <Link href={boutique.href} className="block">
                    {/* Image Section */}
                    <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-t-2xl">
                      <Image
                        src={boutiqueImages[index]}
                        alt={boutique.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Text Content Below */}
                    <div className="p-6 bg-gray-50">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {boutique.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base mb-0">
                        {boutique.subtitle}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Affordable Winter Must-haves Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Affordable <span className="text-pink-600">Winter Must-haves!</span>
            </h2>
            <p className="text-gray-600 text-lg">Snag the hottest deals of the season</p>
          </div>
          
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {[
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_16.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_17.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_18.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_19.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_20.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_21.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_22.jpg',
              'https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_23.jpg'
            ].map((imageUrl, index) => (
              <Link
                key={index}
                href="/products"
                className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              >
                <Image
                  src={imageUrl}
                  alt={`Winter Collection ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Occasion Wear Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Occasion <span className="text-pink-600">Wear</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ethnic Wear Banner */}
            <Link
              href="/products?category=ethnic-wear"
              className="relative rounded-2xl overflow-hidden h-[250px] md:h-[300px] shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
            >
              <Image
                src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_34.jpg"
                alt="Ethnic Wear"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </Link>

            {/* Party Wear Banner */}
            <Link
              href="/products?category=party-wear"
              className="relative rounded-2xl overflow-hidden h-[250px] md:h-[300px] shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
            >
              <Image
                src="https://cdn.fcglcdn.com/brainbees/images/cattemplate/winter_moas_desktop_fashion_page_061225_35.jpg"
                alt="Party Wear"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Baby Diapers & More Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              BABY DIAPERS <span className="text-pink-600">& MORE</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
            {babyCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border border-gray-100 hover:border-pink-200 cursor-pointer text-center"
              >
                <div className="mb-4 text-5xl group-hover:scale-110 transition-transform duration-500">
                  {category.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 min-h-[40px]">
                  {category.name} →
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fashion Trends Section with Real Categories */}
      {allCategories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Shop by <span className="text-pink-600">Category</span>
              </h2>
              <p className="text-gray-600 text-lg">Explore our full range of products</p>
            </div>
            
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4 md:gap-6 min-w-max md:grid md:grid-cols-4 lg:grid-cols-8 md:min-w-0">
                {allCategories.slice(0, 16).map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex-shrink-0 w-36 md:w-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 text-center group border-2 border-gray-200 hover:border-pink-300 cursor-pointer overflow-hidden"
                  >
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="mb-3">
                        {category.image ? (
                          <div className="relative w-full h-20 mb-2">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-500">
                            {category.icon || '🛍️'}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2 min-h-[40px]">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-pink-600 text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-xl group"
              >
                View All Products
                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Additional Premium Boutiques Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">SEASONAL SPECIALS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products?category=summer-collection"
              className="relative rounded-2xl overflow-hidden h-[400px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
              </div>
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center justify-center bg-orange-600 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-center px-2">
                      <div className="text-xs md:text-sm font-bold leading-tight">SUMMER VIBES</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Summer Collection
                  </h3>
                  <p className="text-white text-sm md:text-base mb-4 opacity-90">Stay Cool & Stylish</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-block bg-orange-700 text-white px-6 py-3 rounded-full font-bold text-base md:text-lg shadow-lg">
                      UPTO 50% OFF
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/products?category=festive-wear"
              className="relative rounded-2xl overflow-hidden h-[400px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
              </div>
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center justify-center bg-purple-700 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-center px-2">
                      <div className="text-xs md:text-sm font-bold leading-tight">FESTIVE SPECIAL</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Festive Collection
                  </h3>
                  <p className="text-white text-sm md:text-base mb-4 opacity-90">Celebrate in Style</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-block bg-purple-700 text-white px-6 py-3 rounded-full font-bold text-base md:text-lg shadow-lg">
                      UPTO 55% OFF
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/products?category=casual-wear"
              className="relative rounded-2xl overflow-hidden h-[400px] shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
              </div>
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-center px-2">
                      <div className="text-xs md:text-sm font-bold leading-tight">EVERYDAY STYLE</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Casual Comfort
                  </h3>
                  <p className="text-white text-sm md:text-base mb-4 opacity-90">Everyday Essentials</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-block bg-blue-700 text-white px-6 py-3 rounded-full font-bold text-base md:text-lg shadow-lg">
                      UPTO 45% OFF
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

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

      {/* Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Hot <span className="text-pink-600">Deals!</span>
              </h2>
              <p className="text-gray-600 text-lg">Limited time offers you can't miss</p>
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
                View All Deals <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Franchise Opportunity Banner */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <Link 
            href="/franchise" 
            className="block relative w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border-4 border-orange-400"
          >
            <Image
              src="https://cdn.fcglcdn.com/brainbees/images/intellitots_franchise_16may24.webp"
              alt="Franchise Opportunity - Be a Franchise Owner"
              fill
              sizes="100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </Link>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-12 bg-gradient-to-br from-pink-50 to-purple-50">
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
    </main>
  );
}
