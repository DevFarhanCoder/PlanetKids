import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

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
  // Try same category first
  let products: any[] = [];
  if (categoryIds.length > 0) {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: productId },
        categories: { some: { categoryId: { in: categoryIds } } },
      },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      take: 5,
    });
  }

  // Fallback: fill up to 5 with featured/recent products
  if (products.length < 5) {
    const existingIds = [productId, ...products.map((p) => p.id)];
    const fallback = await prisma.product.findMany({
      where: { isActive: true, id: { notIn: existingIds } },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 5 - products.length,
    });
    products = [...products, ...fallback];
  }

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
