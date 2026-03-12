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

// Vibrant card background colors cycling through with kid-friendly feel
const cardBgColors = [
  "bg-sky-100",
  "bg-rose-100",
  "bg-amber-100",
  "bg-violet-100",
  "bg-emerald-100",
  "bg-pink-100",
  "bg-cyan-100",
  "bg-orange-100",
];

export default function CategoryShowcase({
  title,
  discount,
  items,
  bgColor = "bg-white",
}: CategoryShowcaseProps) {
  return (
    <section className={`py-4 md:py-8 ${bgColor}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-3 md:mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900">
            {title}
          </h2>
        </div>

        {/* Category Grid - Mobile: horizontal scroll, Desktop: 6 column grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-6 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5 pb-4 scrollbar-hide snap-x snap-mandatory md:snap-none">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={item.link}
              className="group cursor-pointer block flex-shrink-0 w-28 sm:w-32 md:w-auto snap-center"
            >
              <div
                className={`${cardBgColors[index % cardBgColors.length]} rounded-2xl p-3 md:p-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1.5 hover:shadow-xl text-center h-full flex flex-col items-center`}
              >
                {/* Circular Image Container */}
                <div className="relative w-full aspect-square mb-2.5 bg-white rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
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
                <h3 className="text-[10px] sm:text-xs md:text-sm font-black text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight text-center">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
