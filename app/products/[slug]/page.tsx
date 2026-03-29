import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

// Cache product pages for 1 hour — products rarely change minute-to-minute
export const revalidate = 3600;

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      categories: {
        include: {
          category: {
            include: {
              parent: true,
            },
          },
        },
      },
      variants: true,
      productLinks: {
        include: {
          linkedProduct: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { take: 1, orderBy: { order: "asc" } },
            },
          },
        },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    shippingCharge: Number(product.shippingCharge),
    averageRating: Number(product.averageRating),
    weight: product.weight ? Number(product.weight) : null,
  };
}

async function getRelatedProducts(productId: string, categoryIds: string[]) {
  // Run both queries in parallel: category-matched + popular fallback
  const [categoryProducts, fallbackProducts] = await Promise.all([
    categoryIds.length > 0
      ? prisma.product.findMany({
          where: {
            isActive: true,
            id: { not: productId },
            categories: { some: { categoryId: { in: categoryIds } } },
          },
          include: { images: { take: 1, orderBy: { order: "asc" } } },
          take: 5,
        })
      : Promise.resolve([]),
    prisma.product.findMany({
      where: { isActive: true, id: { not: productId } },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ]);

  // Category-matched products first, fill remainder with fallback (no duplicates)
  const categoryProductIds = new Set(categoryProducts.map((p) => p.id));
  const uniqueFallback = fallbackProducts.filter(
    (p) => !categoryProductIds.has(p.id),
  );
  const products = [...categoryProducts, ...uniqueFallback].slice(0, 5);

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    averageRating: Number(p.averageRating),
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const categoryIds = product.categories.map((pc) => pc.categoryId);
  const relatedProducts = await getRelatedProducts(product.id, categoryIds);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
