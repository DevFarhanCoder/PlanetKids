import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ageData: Record<string, { name: string; description: string; icon: string; ageRange: string }> = {
  '0-2': { name: '0-2 Years', description: 'Safe products for babies and toddlers', icon: '👶', ageRange: '0-2 years' },
  '3-5': { name: '3-5 Years', description: 'Perfect for preschoolers exploring the world', icon: '🧒', ageRange: '3-5 years' },
  '6-8': { name: '6-8 Years', description: 'Engaging toys for early school age', icon: '👧', ageRange: '6-8 years' },
  '9-12': { name: '9-12 Years', description: 'Advanced products for pre-teens', icon: '👦', ageRange: '9-12 years' },
};

async function getProductsByAge(slug: string) {
  const ageInfo = ageData[slug];
  if (!ageInfo) {
    return null;
  }

  // Fetch products from database
  // For now, fetch featured products as example
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      images: {
        take: 1,
        orderBy: { order: 'asc' }
      }
    },
    take: 20,
    orderBy: { createdAt: 'desc' }
  });

  return {
    ageInfo,
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      image: p.images[0]?.url || null,
      averageRating: Number(p.averageRating),
      reviewCount: p.reviewCount,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival
    }))
  };
}

function calculateDiscount(price: number, comparePrice: number | null): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export default async function AgeGroupPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const data = await getProductsByAge(resolvedParams.slug);
  
  if (!data) {
    notFound();
  }

  const { ageInfo, products } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container-custom text-center">
          <span className="text-7xl mb-4 block">{ageInfo.icon}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {ageInfo.name}
          </h1>
          <p className="text-xl text-gray-600">{ageInfo.description}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <p className="text-gray-600 mb-8">Showing {products.length} products</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.compareAtPrice);
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group border border-gray-100 hover:border-primary-300 cursor-pointer"
              >
                <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-orange-100 overflow-hidden">
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full z-10 shadow-soft">
                      🔥 {discount}% OFF
                    </div>
                  )}
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-3 md:p-5">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors duration-300 min-h-[40px]">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-600">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs md:text-sm text-gray-400 line-through font-semibold">
                        ₹{product.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}