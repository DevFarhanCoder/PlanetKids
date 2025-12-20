import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSectionBySlug(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    
    const res = await fetch(`${baseUrl}/api/home-sections?slug=${slug}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.sections?.[0] || null;
  } catch (error) {
    console.error('Error fetching section:', error);
    return null;
  }
}

export default async function HomeSectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = await getSectionBySlug(slug);
  
  if (!section) {
    notFound();
  }

  const activeItems = section.items.filter((item: any) => item.isActive);

  // Render based on section type
  function renderItems() {
    switch (section.sectionType) {
      case 'GRID':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <Link href={item.link || '/products'} className="block">
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
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    {item.subtitle && <p className="text-gray-600 text-sm md:text-base mb-0">{item.subtitle}</p>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        );

      case 'CAROUSEL':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {activeItems.map((item: any) => (
              <Link
                key={item.id}
                href={item.link || '/products'}
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
        );

      case 'TWO_COLUMN':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map((item: any) => (
              <Link
                key={item.id}
                href={item.link || '/products'}
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
        );

      case 'FULL_WIDTH':
        return (
          <div className="space-y-6">
            {activeItems.map((item: any) => (
              <Link
                key={item.id}
                href={item.link || '/products'}
                className="block relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
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
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map((item: any) => (
              <Link
                key={item.id}
                href={item.link || '/products'}
                className="relative rounded-2xl overflow-hidden h-[300px] shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
            ))}
          </div>
        );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="container-custom">
          <Link
            href="/"
            className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {section.subtitle}
              </p>
            )}
            <div className="mt-4 text-gray-500">
              {activeItems.length} {activeItems.length === 1 ? 'Product' : 'Products'}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container-custom">
          {renderItems()}
        </div>
      </section>

      {/* Back to Home Button */}
      <section className="pb-12">
        <div className="container-custom text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-pink-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-xl group"
          >
            <ChevronLeft className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
