import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CategoryClient from './CategoryClient';

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      },
      parent: true,
      products: {
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      }
    }
  });

  if (!category) {
    return null;
  }

  // Filter active products and transform (convert Decimal to number)
  const products = category.products
    .filter(pc => pc.product.isActive)
    .map(pc => ({
      id: pc.product.id,
      name: pc.product.name,
      slug: pc.product.slug,
      description: pc.product.description,
      price: Number(pc.product.price),
      compareAtPrice: pc.product.compareAtPrice ? Number(pc.product.compareAtPrice) : null,
      image: pc.product.images[0]?.url || null,
      isFeatured: pc.product.isFeatured,
      isNewArrival: pc.product.isNewArrival,
      averageRating: Number(pc.product.averageRating),
      reviewCount: pc.product.reviewCount
    }));

  return {
    ...category,
    products
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Handle both Promise and direct params for compatibility
  const resolvedParams = params instanceof Promise ? await params : params;
  const category = await getCategory(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return <CategoryClient category={category} />;
}