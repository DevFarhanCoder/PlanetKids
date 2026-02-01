import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface CategoryShowcaseProps {
  title: string;
  discount?: string;
  items: CategoryItem[];
  bgColor?: string;
}

export default function CategoryShowcase({
  title,
  discount,
  items,
  bgColor = "bg-white",
}: CategoryShowcaseProps) {
  return (
    <section className={`py-6 md:py-10 lg:py-12 ${bgColor}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
              {title}
            </h2>
            {discount && (
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-gray-500 hidden sm:inline">|</span>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-500">
                  {discount} % OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category Grid - Fully Responsive: 4 on mobile, 6 on tablet+, proper scrolling */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group cursor-pointer block"
            >
              <div className="relative rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden border-2 md:border-3 lg:border-4 border-gray-200 hover:border-primary-400 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1 bg-white">
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 25vw, (max-width: 1024px) 16.66vw, 16.66vw"
                    priority={false}
                  />
                </div>

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-white py-1.5 sm:py-2 md:py-3 px-1 sm:px-2 md:px-3 text-center border-t border-gray-100">
                  <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                    {item.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
