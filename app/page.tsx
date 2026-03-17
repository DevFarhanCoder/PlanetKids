import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Image from "next/image";

// Force dynamic rendering to avoid build-time fetch issues
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHomeData() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/home`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data || {};
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {};
  }
}

async function getHomeSections() {
  try {
    // Directly query database instead of making HTTP call
    const { prisma } = await import("@/lib/prisma");

    const sections = await prisma.homeSection.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
            product: {
              select: { id: true, name: true, slug: true },
            },
          },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    console.log("Home sections fetched:", sections.length);
    return sections;
  } catch (error) {
    console.error("Error fetching home sections:", error);
    return [];
  }
}

// Helper function to calculate discount percentage
function calculateDiscount(price: number, comparePrice: number | null): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

// Product card component
function ProductCard({ product }: { product: any }) {
  const discount = calculateDiscount(
    Number(product.price),
    product.compareAtPrice ? Number(product.compareAtPrice) : null,
  );
  const image = product.images?.[0]?.url;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border border-gray-100 hover:border-primary-300 cursor-pointer"
    >
      <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-orange-100 overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-md">
            🔥 {discount}% OFF
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors duration-300 min-h-[40px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-base md:text-lg font-black text-orange-600">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {product.compareAtPrice &&
            Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-xs md:text-sm text-gray-400 line-through font-semibold">
                ₹{Number(product.compareAtPrice).toLocaleString()}
              </span>
            )}
        </div>
        {/* Return Policy Badge */}
        <div className="flex items-center gap-1 text-[10px] md:text-xs text-green-600 font-semibold">
          <svg
            className="w-3 h-3 md:w-3.5 md:h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="hidden sm:inline">7-Day Return</span>
          <span className="sm:hidden">Returnable</span>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const homeData = await getHomeData();
  const dynamicSections = await getHomeSections();

  console.log("Dynamic sections count:", dynamicSections.length);
  console.log("Dynamic sections:", JSON.stringify(dynamicSections, null, 2));

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

  // Render section based on type
  function renderSection(section: any) {
    console.log(
      "Rendering section:",
      section.name,
      "Type:",
      section.sectionType,
    );
    const activeItems = section.items.filter((item: any) => item.isActive);
    console.log("Active items:", activeItems.length);

    if (activeItems.length === 0) {
      console.log("No active items, skipping section");
      return null;
    }

    switch (section.sectionType) {
      case "GRID":
        return (
          <section key={section.id} className="py-5 md:py-8 bg-white">
            <div className="container-custom">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                    {section.title}
                  </span>
                </h2>
                {section.subtitle && (
                  <p className="text-gray-500 text-base font-medium">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeItems.slice(0, 6).map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
                  >
                    <Link href={item.link} className="block">
                      <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-t-2xl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {item.badge && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                            {item.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-pink-50">
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-gray-500 text-sm mb-0">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {activeItems.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/home-sections/${section.slug}`}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-base font-black hover:shadow-xl transition-all duration-300 shadow-md group transform hover:scale-105"
                  >
                    Explore More Products
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        );

      case "CAROUSEL":
        return (
          <section
            key={section.id}
            className="py-10 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50"
          >
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {section.title}
                  </span>
                </h2>
                {section.subtitle && (
                  <p className="text-gray-500 text-base font-medium">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {activeItems.slice(0, 6).map((item: any) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16.66vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.discount && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                        {item.discount}% OFF
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              {activeItems.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/home-sections/${section.slug}`}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-base font-black hover:shadow-xl transition-all duration-300 shadow-md group transform hover:scale-105"
                  >
                    Explore More Products
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        );

      case "TWO_COLUMN":
        return (
          <section key={section.id} className="py-10 bg-white">
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">
                    {section.title}
                  </span>
                </h2>
                {section.subtitle && (
                  <p className="text-gray-500 text-base font-medium">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeItems.slice(0, 6).map((item: any) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="relative rounded-2xl overflow-hidden h-[250px] md:h-[300px] shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {item.badge && (
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-sm font-bold px-4 py-2 rounded-lg z-10">
                        {item.badge}
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              {activeItems.length > 6 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/home-sections/${section.slug}`}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-base font-black hover:shadow-xl transition-all duration-300 shadow-md group transform hover:scale-105"
                  >
                    Explore More Products
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        );

      case "FULL_WIDTH":
        return (
          <section key={section.id} className="py-12 bg-white">
            <div className="container-custom">
              {activeItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block relative w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border-4 border-orange-400"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Carousel - Full Width */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* Shop by Age Section */}
      <section className="py-4 md:py-8 bg-white">
        <div className="container-custom">
          <div className="mb-4 md:mb-6 text-center">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1">
              Shop by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Age
              </span>
            </h2>
            <p className="text-gray-500 text-xs md:text-base font-medium">
              Find the perfect toys for your child's age group
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center">
              {/* 0-2 Years */}
              <Link
                href="/age/0-2"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl p-3 md:p-4 transition-all duration-400 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 bg-white/70 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Soft Toys/1.jpg"
                      alt="0-2 Years"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-gray-900 group-hover:text-pink-700 transition-colors duration-300 mb-0.5">
                    0-2 Years
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 font-semibold">
                    Babies & Toddlers
                  </p>
                </div>
              </Link>

              {/* 3-5 Years */}
              <Link
                href="/age/3-5"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-yellow-100 to-amber-200 rounded-2xl p-3 md:p-4 transition-all duration-400 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center border-2 border-amber-300">
                  <div className="relative w-full aspect-square mb-2.5 bg-white/70 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/1.jpg"
                      alt="3-5 Years"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-amber-700 group-hover:text-amber-800 transition-colors duration-300 mb-0.5">
                    3-5 Years
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 font-semibold">
                    Preschoolers
                  </p>
                </div>
              </Link>

              {/* 6-8 Years */}
              <Link
                href="/age/6-8"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl p-3 md:p-4 transition-all duration-400 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 bg-white/70 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/Marvel/1.jpg"
                      alt="6-8 Years"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-blue-700 group-hover:text-blue-800 transition-colors duration-300 mb-0.5">
                    6-8 Years
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 font-semibold">
                    Early School Age
                  </p>
                </div>
              </Link>

              {/* 9-12 Years */}
              <Link
                href="/age/9-12"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-3 md:p-4 transition-all duration-400 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 bg-white/70 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/8. Remote Controls and Battery Toys'/RC cars/1.jpg"
                      alt="9-12 Years"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-green-700 group-hover:text-green-800 transition-colors duration-300 mb-0.5">
                    9-12 Years
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 font-semibold">
                    Pre-Teens
                  </p>
                </div>
              </Link>

              {/* 12+ Years */}
              <Link
                href="/age/12-plus"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl p-3 md:p-4 transition-all duration-400 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 bg-white/70 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/9. Board Games and Puzzles/Business games.jpg"
                      alt="12+ Years"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-purple-700 group-hover:text-purple-800 transition-colors duration-300 mb-0.5">
                    12+ Years
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 font-semibold">
                    Teens & Beyond
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section with Real Product Images */}
      <section className="py-4 md:py-8 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
          <div className="mb-4 md:mb-6 text-center">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1">
              Explore{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                Categories
              </span>
            </h2>
            <p className="text-gray-500 text-xs md:text-base font-medium">
              Explore our full range of products
            </p>
          </div>

          {/* Horizontally scrollable — all cards equal size */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center">
            {[
              {
                href: "/categories/baby-infant-toys",
                bg: "bg-pink-100",
                hover: "group-hover:text-pink-600",
                img: "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Soft Toys/1.jpg",
                alt: "Baby & Infant Toys",
                label: "Baby & Infant",
              },
              {
                href: "/categories/preschool-learning-toys",
                bg: "bg-amber-100",
                hover: "group-hover:text-amber-600",
                img: "/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/1.jpg",
                alt: "Preschool & Learning",
                label: "Preschool",
              },
              {
                href: "/categories/building-construction-toys",
                bg: "bg-sky-100",
                hover: "group-hover:text-sky-600",
                img: "/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/Alphabet Toys/1.jpg",
                alt: "Building & Construction",
                label: "Building",
              },
              {
                href: "/categories/action-figures-superheroes",
                bg: "bg-red-100",
                hover: "group-hover:text-red-600",
                img: "/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/Marvel/1.jpg",
                alt: "Action Figures",
                label: "Action Figures",
              },
              {
                href: "/categories/dolls-doll-accessories",
                bg: "bg-fuchsia-100",
                hover: "group-hover:text-fuchsia-600",
                img: "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/Fashion dolls/1.jpg",
                alt: "Dolls",
                label: "Dolls",
              },
              {
                href: "/categories/outdoor-sports-toys",
                bg: "bg-green-100",
                hover: "group-hover:text-green-600",
                img: "/toys/Planet_Kids_Toys/6. Outdoor and Sports Toys/1.jpg",
                alt: "Outdoor & Sports",
                label: "Outdoor & Sports",
              },
              {
                href: "/categories/ride-on-toys-scooters",
                bg: "bg-orange-100",
                hover: "group-hover:text-orange-600",
                img: "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/push cars/1.jpg",
                alt: "Ride-On Toys",
                label: "Ride-On Toys",
              },
              {
                href: "/categories/soft-toys-plush",
                bg: "bg-rose-100",
                hover: "group-hover:text-rose-600",
                img: "/toys/Planet_Kids_Toys/10. Soft Toys and Plush/Teddy bears/3.jpg",
                alt: "Soft Toys",
                label: "Soft Toys",
              },
            ].map(({ href, bg, hover, img, alt, label }) => (
              <Link
                key={href}
                href={href}
                className="group cursor-pointer block flex-shrink-0 w-[130px] md:w-[150px] snap-center"
              >
                <div
                  className={`${bg} rounded-2xl p-3 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center flex flex-col items-center h-full`}
                >
                  <div className="relative w-full aspect-square mb-2 bg-white rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={img}
                      alt={alt}
                      fill
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      sizes="150px"
                    />
                  </div>
                  <h3
                    className={`font-black text-xs text-gray-800 ${hover} transition-colors line-clamp-2 leading-tight`}
                  >
                    {label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Products Button */}
          <div className="text-center mt-4 md:mt-6">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-10 md:px-14 py-3 md:py-4 rounded-full text-base md:text-lg font-black hover:shadow-xl transition-all duration-300 shadow-md group transform hover:scale-105"
            >
              View All Products
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Baby & Infant Toys - Soft Toys Category */}
      <CategoryShowcase
        title="Baby & Infant Toys"
        bgColor="bg-gradient-to-br from-blue-50 via-gray-50 to-yellow-50"
        items={[
          {
            id: "1",
            name: "Soft Teddy Bears",
            image:
              "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Soft Toys/1.jpg",
            link: "/categories/baby-infant-toys",
          },
          {
            id: "2",
            name: "Baby Teethers",
            image:
              "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Teethers/1.jpg",
            link: "/categories/baby-infant-toys",
          },
          {
            id: "3",
            name: "Colorful Rattles",
            image:
              "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Rattles/1.jpg",
            link: "/categories/baby-infant-toys",
          },
          {
            id: "4",
            name: "Preschool Toys",
            image:
              "/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/1.jpg",
            link: "/categories/preschool-learning-toys",
          },
          {
            id: "5",
            name: "Alphabet Toys",
            image:
              "/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/Alphabet Toys/1.jpg",
            link: "/categories/preschool-learning-toys",
          },
          {
            id: "6",
            name: "Montessori Toys",
            image:
              "/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/Montessori Toys/1.jpg",
            link: "/categories/preschool-learning-toys",
          },
        ]}
      />

      {/* Soft Toys & Plush Category */}
      <CategoryShowcase
        title="Soft Toys & Plush"
        bgColor="bg-white"
        items={[
          {
            id: "7",
            name: "Big Teddy Bears",
            image:
              "/toys/Planet_Kids_Toys/10. Soft Toys and Plush/Teddy bears/3.jpg",
            link: "/categories/soft-toys-plush",
          },
          {
            id: "8",
            name: "Cute Animals",
            image:
              "/toys/Planet_Kids_Toys/10. Soft Toys and Plush/animals/1.jpg",
            link: "/categories/soft-toys-plush",
          },
          {
            id: "9",
            name: "Baby Dolls",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/baby dolls/1.jpg",
            link: "/categories/dolls-doll-accessories",
          },
          {
            id: "10",
            name: "Fashion Dolls",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/Fashion dolls/1.jpg",
            link: "/categories/dolls-doll-accessories",
          },
          {
            id: "11",
            name: "Doll Houses",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/doll houses/1.jpg",
            link: "/categories/dolls-doll-accessories",
          },
          {
            id: "12",
            name: "Doll Furniture",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/doll furniture/1.jpg",
            link: "/categories/dolls-doll-accessories",
          },
        ]}
      />

      {/* Ride-On Toys Category */}
      <CategoryShowcase
        title="Ride-On Toys"
        bgColor="bg-gradient-to-br from-orange-50 via-yellow-50 to-gray-50"
        items={[
          {
            id: "13",
            name: "Push Cars",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/push cars/1.jpg",
            link: "/categories/ride-on-toys-scooters",
          },
          {
            id: "14",
            name: "Push Cars",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/push cars/2.jpg",
            link: "/categories/ride-on-toys-scooters",
          },
          {
            id: "15",
            name: "Battery Vehicles",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/battery-operated vehicles/1.jpg",
            link: "/categories/ride-on-toys-scooters",
          },
          {
            id: "16",
            name: "Scooty Rides",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/Scooty ride-ons/1.jpg",
            link: "/categories/ride-on-toys-scooters",
          },
          {
            id: "17",
            name: "Action Figures",
            image:
              "/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/Marvel/1.jpg",
            link: "/categories/action-figures-superheroes",
          },
          {
            id: "18",
            name: "DC Heroes",
            image:
              "/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/DC/1.jpg",
            link: "/categories/action-figures-superheroes",
          },
        ]}
      />

      {/* View All Products Button */}
      <section className="py-2 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
          <Link
            href="/products"
            className="block w-full bg-white border-2 border-gray-200 rounded-2xl py-4 md:py-5 text-center hover:border-primary-400 hover:shadow-lg transition-all duration-300 group"
          >
            <span className="text-base md:text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
              View All Products
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Dynamic Admin-Managed Sections */}
      {dynamicSections.map((section: any) => renderSection(section))}

      {/* Video/Reel Section - Engaging Content */}
      <section className="py-3 md:py-5 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-black text-gray-900">
              Watch Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Fun Videos! 🎥
              </span>
            </h2>
            <p className="text-gray-500 text-xs font-semibold">
              See our amazing toys in action
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:snap-none">
            {/* Video Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-purple-200 flex-shrink-0 w-[150px] sm:w-[165px] md:w-auto snap-center">
              <div className="relative h-[100px] bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
                    <svg
                      className="w-4 h-4 text-purple-600 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  LIVE
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1">
                  Toy Unboxing &amp; Review
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                  Watch kids having fun with our latest toys!
                </p>
              </div>
            </div>

            {/* Video Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-blue-200 flex-shrink-0 w-[150px] sm:w-[165px] md:w-auto snap-center">
              <div className="relative h-[100px] bg-gradient-to-br from-blue-100 to-cyan-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
                    <svg
                      className="w-4 h-4 text-blue-600 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  TRENDING{" "}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1">
                  Learning Toys Demo
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                  Educational toys that make learning fun!
                </p>
              </div>
            </div>

            {/* Video Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-pink-200 flex-shrink-0 w-[150px] sm:w-[165px] md:w-auto snap-center">
              <div className="relative h-[100px] bg-gradient-to-br from-pink-100 to-rose-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow cursor-pointer">
                    <svg
                      className="w-4 h-4 text-pink-600 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-1.5 left-1.5 bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  NEW{" "}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1">
                  Holiday Gift Guide
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                  Perfect gift ideas for every occasion!
                </p>
              </div>
            </div>
          </div>

          {/* View All Videos Button */}
          <div className="text-center mt-6 md:mt-8">
            <Link
              href="/videos"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 md:px-12 py-2.5 md:py-3 rounded-full text-sm md:text-base font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Watch More Videos
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Premium Boutiques Section */}
      <section className="py-5 md:py-8 bg-white">
        <div className="container-custom">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              SEASONAL{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-gray-800">
                SPECIALS
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center">
              <Link
                href="/categories/seasonal-festival-toys"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-orange-200 to-amber-300 rounded-2xl p-3 md:p-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/6. Outdoor and Sports Toys/Cricket sets/1.jpg"
                      alt="Seasonal Toys"
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-orange-800 group-hover:text-orange-900 transition-colors mb-0.5">
                    Seasonal Toys
                  </h3>
                  <p className="text-[10px] md:text-xs text-orange-700 font-semibold">
                    Upto 50% Off
                  </p>
                </div>
              </Link>
              <Link
                href="/categories/water-sand-play-toys"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-purple-200 to-indigo-300 rounded-2xl p-3 md:p-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/6. Outdoor and Sports Toys/1.jpg"
                      alt="Water Play"
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-purple-800 group-hover:text-purple-900 transition-colors mb-0.5">
                    Water Play
                  </h3>
                  <p className="text-[10px] md:text-xs text-purple-700 font-semibold">
                    Splash into Fun
                  </p>
                </div>
              </Link>
              <Link
                href="/categories/premium-collectors-items"
                className="group cursor-pointer block flex-shrink-0 w-[130px] sm:w-[160px] md:w-[180px] snap-center"
              >
                <div className="bg-gradient-to-br from-sky-200 to-cyan-300 rounded-2xl p-3 md:p-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden h-full flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src="/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/Marvel/1.jpg"
                      alt="Premium"
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                  <h3 className="font-black text-sm md:text-base text-blue-800 group-hover:text-blue-900 transition-colors mb-0.5">
                    Premium
                  </h3>
                  <p className="text-[10px] md:text-xs text-blue-700 font-semibold">
                    Upto 45% Off
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-5 md:py-8 bg-gradient-to-br from-orange-50 via-gray-50 to-gray-100">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-5 md:mb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                  New{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-gray-800">
                    ✨ Arrivals
                  </span>
                </h2>
                <p className="text-gray-600 text-lg font-semibold">
                  Discover the latest additions to our collection
                </p>
              </div>
              <Link
                href="/new-arrivals"
                className="hidden md:flex items-center text-primary-700 font-black hover:text-primary-800 text-lg group"
              >
                View All{" "}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
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
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                  Trending{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
                    🔥 Now
                  </span>
                </h2>
                <p className="text-gray-600 text-lg font-semibold">
                  Most popular items this week
                </p>
              </div>
              <Link
                href="/products?trending=true"
                className="hidden md:flex items-center text-gray-800 font-black hover:text-gray-900 text-lg group"
              >
                View All{" "}
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
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
        <section className="py-16 bg-gradient-to-br from-primary-50 via-orange-50 to-gray-50">
          <div className="container-custom">
            <div className="mb-10 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                Hot{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-orange-500">
                  🔥 Deals!
                </span>
              </h2>
              <p className="text-gray-600 text-lg font-semibold">
                Limited time offers you can't miss
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {saleProducts.slice(0, 12).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/products?sale=true"
                className="inline-flex items-center text-gray-800 font-semibold hover:text-gray-900"
              >
                View All Deals <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges - Modern Design */}
      <section className="py-4 md:py-6 bg-white border-y border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
            <div className="text-center p-3 md:p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-orange-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-1 text-sm md:text-xl">
                Free Shipping
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-semibold">
                On Prepaid Orders
              </p>
            </div>
            <div className="text-center p-3 md:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-1 text-sm md:text-xl">
                Secure Payments
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-semibold">
                100% Safe Transactions
              </p>
            </div>
            <div className="text-center p-3 md:p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-1 text-sm md:text-xl">
                Easy Returns
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-semibold">
                7-Day Return Policy
              </p>
            </div>
            <div className="text-center p-3 md:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-1 text-sm md:text-xl">
                Quality Assured
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-semibold">
                Verified Products
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
