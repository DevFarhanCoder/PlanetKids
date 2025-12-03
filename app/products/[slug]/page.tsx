import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' }
      },
      categories: {
        include: {
          category: {
            include: {
              parent: true
            }
          }
        }
      },
      variants: true
    }
  });

  if (!product || !product.isActive) {
    return null;
  }

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    averageRating: Number(product.averageRating),
    weight: product.weight ? Number(product.weight) : null
  };
}

async function getRelatedProducts(productId: string, categoryIds: string[]) {
  if (categoryIds.length === 0) return [];

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      categories: {
        some: {
          categoryId: { in: categoryIds }
        }
      }
    },
    include: {
      images: {
        take: 1,
        orderBy: { order: 'asc' }
      }
    },
    take: 4
  });

  return products.map(p => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    averageRating: Number(p.averageRating)
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const categoryIds = product.categories.map(pc => pc.categoryId);
  const relatedProducts = await getRelatedProducts(product.id, categoryIds);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}