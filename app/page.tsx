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
          <div className="absolute top-3 left-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-soft">
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
      <div className="p-3 md:p-5">
        <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors duration-300 min-h-[40px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-600">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {product.compareAtPrice &&
            Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-xs md:text-sm text-gray-400 line-through font-semibold">
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
          <section key={section.id} className="py-12 bg-white">
            <div className="container-custom">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-gray-600 text-lg">{section.subtitle}</p>
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
                      <div className="p-6 bg-gray-50">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-gray-600 text-sm md:text-base mb-0">
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
                    className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-3 rounded-full text-base font-bold hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-xl group"
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
          <section key={section.id} className="py-12 bg-gray-50">
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-gray-600 text-lg">{section.subtitle}</p>
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
                    className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-3 rounded-full text-base font-bold hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-xl group"
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
          <section key={section.id} className="py-12 bg-white">
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-gray-600 text-lg">{section.subtitle}</p>
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
                    className="inline-flex items-center justify-center bg-gray-800 text-white px-8 py-3 rounded-full text-base font-bold hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-xl group"
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
      {/* Hero Carousel */}
      <section className="container-custom py-6">
        <HeroCarousel />
      </section>

      {/* Baby & Infant Toys - Soft Toys Category */}
      <CategoryShowcase
        title="Baby & Infant Toys"
        discount="40"
        bgColor="bg-gradient-to-br from-blue-50 via-gray-50 to-yellow-50"
        items={[
          {
            id: "1",
            name: "Soft Teddy Bears",
            image:
              "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Soft Toys/1.jpg",
            link: "/categories/soft-toys",
          },
          {
            id: "2",
            name: "Baby Teethers",
            image:
              "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Teethers/1.jpg",
            link: "/categories/teethers",
          },
          {
            id: "3",
            name: "Colorful Rattles",
            image:
              "/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Rattles/1.jpg",
            link: "/categories/rattles",
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
            link: "/categories/alphabet-toys",
          },
          {
            id: "6",
            name: "Montessori Toys",
            image:
              "/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/Montessori Toys/1.jpg",
            link: "/categories/montessori-toys",
          },
        ]}
      />

      {/* Soft Toys & Plush Category */}
      <CategoryShowcase
        title="Soft Toys & Plush"
        discount="FLAT 50"
        bgColor="bg-white"
        items={[
          {
            id: "7",
            name: "Big Teddy Bears",
            image:
              "/toys/Planet_Kids_Toys/10. Soft Toys and Plush/Teddy bears/3.jpg",
            link: "/categories/teddy-bears",
          },
          {
            id: "8",
            name: "Cute Animals",
            image:
              "/toys/Planet_Kids_Toys/10. Soft Toys and Plush/animals/1.jpg",
            link: "/categories/animal-toys",
          },
          {
            id: "9",
            name: "Baby Dolls",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/baby dolls/1.jpg",
            link: "/categories/baby-dolls",
          },
          {
            id: "10",
            name: "Fashion Dolls",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/Fashion dolls/1.jpg",
            link: "/categories/fashion-dolls",
          },
          {
            id: "11",
            name: "Doll Houses",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/doll houses/1.jpg",
            link: "/categories/doll-houses",
          },
          {
            id: "12",
            name: "Doll Furniture",
            image:
              "/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/doll furniture/1.jpg",
            link: "/categories/doll-accessories",
          },
        ]}
      />

      {/* Ride-On Toys Category */}
      <CategoryShowcase
        title="Ride-On Toys"
        discount="30"
        bgColor="bg-gradient-to-br from-orange-50 via-yellow-50 to-gray-50"
        items={[
          {
            id: "13",
            name: "Push Cars",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/push cars/1.jpg",
            link: "/categories/push-cars",
          },
          {
            id: "14",
            name: "Push Cars",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/push cars/2.jpg",
            link: "/categories/push-cars",
          },
          {
            id: "15",
            name: "Battery Vehicles",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/battery-operated vehicles/1.jpg",
            link: "/categories/battery-vehicles",
          },
          {
            id: "16",
            name: "Scooty Rides",
            image:
              "/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/Scooty ride-ons/1.jpg",
            link: "/categories/scooters",
          },
          {
            id: "17",
            name: "Action Figures",
            image:
              "/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/Marvel/1.jpg",
            link: "/categories/action-figures",
          },
          {
            id: "18",
            name: "DC Heroes",
            image:
              "/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/DC/1.jpg",
            link: "/categories/superhero-toys",
          },
        ]}
      />

      {/* Board Games & Puzzles Category */}
      <CategoryShowcase
        title="Board Games & Puzzles"
        discount="BUY 2 GET 1 FREE"
        bgColor="bg-white"
        items={[
          {
            id: "19",
            name: "Jigsaw Puzzles",
            image:
              "/toys/Planet_Kids_Toys/9. Board Games and Puzzles/jigsaw puzzles/1.jpg",
            link: "/categories/jigsaw-puzzles",
          },
          {
            id: "20",
            name: "Chess Sets",
            image:
              "/toys/Planet_Kids_Toys/9. Board Games and Puzzles/Chess/1.jpg",
            link: "/categories/chess",
          },
          {
            id: "21",
            name: "Indian Map Puzzle",
            image:
              "/toys/Planet_Kids_Toys/9. Board Games and Puzzles/jigsaw puzzles/Indian Map Puzzle.jpg",
            link: "/categories/jigsaw-puzzles",
          },
          {
            id: "22",
            name: "Business Games",
            image:
              "/toys/Planet_Kids_Toys/9. Board Games and Puzzles/Business games.jpg",
            link: "/categories/board-games",
          },
          {
            id: "23",
            name: "Chess Puzzle",
            image:
              "/toys/Planet_Kids_Toys/9. Board Games and Puzzles/Chess/Chess Puzzle.jpg",
            link: "/categories/chess",
          },
          {
            id: "24",
            name: "Outdoor Sports",
            image: "/toys/Planet_Kids_Toys/6. Outdoor and Sports Toys/1.jpg",
            link: "/categories/outdoor-sports-toys",
          },
        ]}
      />

      {/* Remote Control & Battery Toys Category */}
      <CategoryShowcase
        title="RC & Battery Toys"
        discount="45"
        bgColor="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50"
        items={[
          {
            id: "25",
            name: "RC Cars",
            image:
              "/toys/Planet_Kids_Toys/8. Remote Controls and Battery Toys'/RC cars/1.jpg",
            link: "/categories/rc-cars",
          },
          {
            id: "26",
            name: "RC Cars",
            image:
              "/toys/Planet_Kids_Toys/8. Remote Controls and Battery Toys'/RC cars/2.jpg",
            link: "/categories/rc-cars",
          },
          {
            id: "27",
            name: "RC Robots",
            image:
              "/toys/Planet_Kids_Toys/8. Remote Controls and Battery Toys'/robots/1.jpg",
            link: "/categories/rc-robots",
          },
          {
            id: "28",
            name: "RC Vehicles",
            image:
              "/toys/Planet_Kids_Toys/8. Remote Controls and Battery Toys'/rechargeable vehicles/1.jpg",
            link: "/categories/battery-vehicles",
          },
          {
            id: "29",
            name: "STEM Robotics",
            image:
              "/toys/Planet_Kids_Toys/11. Electronic and STEM Toys/robotics/1.jpg",
            link: "/categories/stem-toys",
          },
          {
            id: "30",
            name: "Science Kits",
            image:
              "/toys/Planet_Kids_Toys/11. Electronic and STEM Toys/Science kits/1.jpg",
            link: "/categories/science-kits",
          },
        ]}
      />

      {/* View All Boutiques Button */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
          <Link
            href="/products"
            className="block w-full bg-white border-2 border-gray-200 rounded-2xl py-4 md:py-5 text-center hover:border-primary-400 hover:shadow-lg transition-all duration-300 group"
          >
            <span className="text-base md:text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
              View All Boutiques
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Dynamic Admin-Managed Sections */}
      {dynamicSections.map((section: any) => renderSection(section))}

      {/* Shop by Category Section with Real Product Images */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 md:mb-3">
              Shop by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Category
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg font-semibold">
              Explore our full range of products
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 lg:gap-6">
            {/* Baby & Infant Toys */}
            <Link
              href="/categories/baby-infant-toys"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/1. Baby and Infant Toys/Soft Toys/1.jpg"
                    alt="Baby & Infant Toys"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Baby & Infant Toys
                </h3>
              </div>
            </Link>

            {/* Preschool & Learning */}
            <Link
              href="/categories/preschool-learning-toys"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/1.jpg"
                    alt="Preschool & Learning"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Preschool & Learning
                </h3>
              </div>
            </Link>

            {/* Building & Construction */}
            <Link
              href="/categories/building-construction-toys"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/Alphabet Toys/1.jpg"
                    alt="Building & Construction"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Building & Construction
                </h3>
              </div>
            </Link>

            {/* Action Figures & Superheroes */}
            <Link
              href="/categories/action-figures"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/4. Action Figures and Superheroes/Marvel/1.jpg"
                    alt="Action Figures"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Action Figures
                </h3>
              </div>
            </Link>

            {/* Dolls & Doll Accessories */}
            <Link
              href="/categories/fashion-dolls"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/5. Dolls and Doll Accessories/Fashion dolls/1.jpg"
                    alt="Dolls & Accessories"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Dolls & Accessories
                </h3>
              </div>
            </Link>

            {/* Outdoor & Sports */}
            <Link
              href="/categories/outdoor-sports-toys"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/6. Outdoor and Sports Toys/1.jpg"
                    alt="Outdoor & Sports"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Outdoor & Sports
                </h3>
              </div>
            </Link>

            {/* Ride-On Toys & Scooters */}
            <Link
              href="/categories/push-cars"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/7. Ride On Toys and Scooters/push cars/1.jpg"
                    alt="Ride-On Toys"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Ride-On Toys
                </h3>
              </div>
            </Link>

            {/* Remote Control & Battery */}
            <Link
              href="/categories/rc-cars"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/8. Remote Controls and Battery Toys'/RC cars/1.jpg"
                    alt="Remote Control"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Remote Control
                </h3>
              </div>
            </Link>

            {/* Board Games & Puzzles */}
            <Link
              href="/categories/board-games"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/9. Board Games and Puzzles/Chess/1.jpg"
                    alt="Board Games"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Board Games
                </h3>
              </div>
            </Link>

            {/* Soft Toys & Plush */}
            <Link
              href="/categories/teddy-bears"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/10. Soft Toys and Plush/Teddy bears/3.jpg"
                    alt="Soft Toys"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Soft Toys & Plush
                </h3>
              </div>
            </Link>

            {/* Electronic & STEM */}
            <Link
              href="/categories/stem-toys"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/11. Electronic and STEM Toys/robotics/1.jpg"
                    alt="Electronic & STEM"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Electronic & STEM
                </h3>
              </div>
            </Link>

            {/* Arts, Craft & DIY */}
            <Link
              href="/categories/arts-crafts"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/12. Arts, Craft and DIY Sets/Painting Kits/1.jpg"
                    alt="Arts & Craft"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Arts, Craft & DIY
                </h3>
              </div>
            </Link>

            {/* Kitchen & Role Play */}
            <Link
              href="/categories/kitchen-role-play"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/13. Kitchen and Role Play Toys/Mini kitchen sets/1.jpg"
                    alt="Kitchen & Role Play"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Kitchen & Role Play
                </h3>
              </div>
            </Link>

            {/* Musical Instruments */}
            <Link
              href="/categories/musical-instruments"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/14. Musical Instruments for kids/Toy guitars/1.jpg"
                    alt="Musical Instruments"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Musical Instruments
                </h3>
              </div>
            </Link>

            {/* Educational Books */}
            <Link
              href="/categories/educational-books"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/2. Preschool and Learning Toys/Montessori Toys/1.jpg"
                    alt="Educational Books"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Educational Books
                </h3>
              </div>
            </Link>

            {/* Party Favours */}
            <Link
              href="/categories/party-favours"
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-center overflow-hidden border border-gray-100 hover:border-primary-300">
                <div className="relative w-full aspect-square mb-2 md:mb-3">
                  <Image
                    src="/toys/Planet_Kids_Toys/10. Soft Toys and Plush/animals/1.jpg"
                    alt="Party Favours"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 12.5vw"
                  />
                </div>
                <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  Party Favours
                </h3>
              </div>
            </Link>
          </div>

          <div className="text-center mt-8 md:mt-10">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white px-10 md:px-14 py-3 md:py-4 rounded-full text-base md:text-lg font-bold hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl group transform hover:scale-105"
            >
              View All Products
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Premium Boutiques Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              SEASONAL{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-gray-800">
                SPECIALS
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/products?category=summer-collection"
              className="relative rounded-3xl overflow-hidden h-[400px] shadow-soft-lg hover:shadow-soft-xl transition-all duration-500 transform hover:scale-[1.02] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-orange-500">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                ></div>
              </div>

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center justify-center bg-orange-600 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-center px-2">
                      <div className="text-xs md:text-sm font-bold leading-tight">
                        SUMMER VIBES
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Summer Collection
                  </h3>
                  <p className="text-white text-sm md:text-base mb-4 opacity-90">
                    Stay Cool & Stylish
                  </p>
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
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                ></div>
              </div>

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center justify-center bg-purple-700 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-center px-2">
                      <div className="text-xs md:text-sm font-bold leading-tight">
                        FESTIVE SPECIAL
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Festive Collection
                  </h3>
                  <p className="text-white text-sm md:text-base mb-4 opacity-90">
                    Celebrate in Style
                  </p>
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
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                ></div>
              </div>

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-center px-2">
                      <div className="text-xs md:text-sm font-bold leading-tight">
                        EVERYDAY STYLE
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Casual Comfort
                  </h3>
                  <p className="text-white text-sm md:text-base mb-4 opacity-90">
                    Everyday Essentials
                  </p>
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
        <section className="py-16 bg-gradient-to-br from-orange-50 via-gray-50 to-gray-100">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-10">
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

      {/* Trust Badges - Modern Design */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-orange-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-2 text-lg md:text-xl">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600 font-semibold">
                On Prepaid Orders
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-2 text-lg md:text-xl">
                Secure Payments
              </h3>
              <p className="text-sm text-gray-600 font-semibold">
                100% Safe Transactions
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-2 text-lg md:text-xl">
                Easy Returns
              </h3>
              <p className="text-sm text-gray-600 font-semibold">
                7-Day Return Policy
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all">
              <h3 className="font-black text-gray-900 mb-2 text-lg md:text-xl">
                Quality Assured
              </h3>
              <p className="text-sm text-gray-600 font-semibold">
                Verified Products
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
