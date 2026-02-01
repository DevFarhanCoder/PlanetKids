import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Convert Prisma Decimal to number for client component
  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));

  return <ProductsClient products={serializedProducts} categories={categories} />;
}
