import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim().toLowerCase();

    // Search in products, categories, and brands
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { brand: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: {
            take: 1,
            orderBy: { order: "asc" },
          },
          brand: true,
        },
        take: 8,
        orderBy: [{ viewCount: "desc" }, { salesCount: "desc" }],
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: searchTerm, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
        },
        take: 5,
      }),
    ]);

    // Extract unique brands from products
    const brandSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.toLowerCase().includes(searchTerm)) {
        brandSet.add(p.brand);
      }
    });
    const brands = Array.from(brandSet).slice(0, 3);

    const suggestions = {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        image: p.images[0]?.url || null,
        brand: p.brand,
        type: "product",
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        type: "category",
      })),
      brands: brands.map((brand) => ({
        name: brand,
        type: "brand",
      })),
    };

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
