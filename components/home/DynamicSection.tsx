import Image from 'next/image';
import Link from 'next/link';

interface HomeSectionItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string;
  badge: string | null;
  discount: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface HomeSection {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string | null;
  sectionType: 'GRID' | 'CAROUSEL' | 'TWO_COLUMN' | 'FULL_WIDTH';
  displayOrder: number;
  isActive: boolean;
  items: HomeSectionItem[];
}

export default function DynamicSection({ section }: { section: HomeSection }) {
  const getBgClass = () => {
    switch (section.sectionType) {
      case 'GRID':
        return 'bg-white';
      case 'CAROUSEL':
        return 'bg-gray-50';
      case 'TWO_COLUMN':
        return 'bg-white';
      case 'FULL_WIDTH':
        return 'bg-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <section className={`py-12 ${getBgClass()}`}>
      <div className="container-custom">
        {/* Section Header */}
        {(section.title || section.subtitle) && (
          <div className="text-center mb-8">
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="text-gray-600 text-lg">{section.subtitle}</p>
            )}
          </div>
        )}

        {/* Section Content */}
        {section.sectionType === 'CAROUSEL' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
              >
                <Link href={item.link} className="block">
                  {/* Image Section */}
                  <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-t-2xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {item.badge && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                        {item.badge}
                      </div>
                    )}
                  </div>

                  {/* Text Content Below */}
                  <div className="p-6 bg-gray-50">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-gray-600 text-sm md:text-base mb-0">
                        {item.subtitle}
                      </p>
                    )}
                    {item.discount && (
                      <p className="text-pink-600 font-bold mt-2">{item.discount}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {section.sectionType === 'GRID' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {section.items.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {item.badge && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                    {item.badge}
                  </div>
                )}
                {item.discount && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {item.discount}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {section.sectionType === 'TWO_COLUMN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.items.map((item) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-pink-200 text-lg">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    {item.badge}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {section.sectionType === 'FULL_WIDTH' && (
          <div>
            {section.items.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="block relative w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
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
        )}
      </div>
    </section>
  );
}
