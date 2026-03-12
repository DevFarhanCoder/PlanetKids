import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getNewArrivals() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isNewArrival: true,
      },
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 24,
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      image: product.images[0]?.url || null,
      averageRating: Number(product.averageRating),
      reviewCount: product.reviewCount,
      isNewArrival: true,
      isActive: product.isActive,
    }));
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-semibold text-gray-900">Just Arrived</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h1>
          <p className="text-xl text-gray-600">
            Discover our latest collection of exciting products for kids
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container-custom py-12">
        {products.length > 0 ? (
          <>
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {products.length} new products
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No New Arrivals Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for exciting new products!
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
