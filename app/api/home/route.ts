import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Cache API response for 60 seconds — database is only queried once per minute
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Run all 10 queries in parallel instead of sequentially
    const [
      featuredCategories,
      allCategories,
      featuredProducts,
      saleProducts,
      newArrivals,
      trendingProducts,
      babyProducts,
      winterProducts,
      ethnicProducts,
      partyWearProducts,
    ] = await Promise.all([
      // 1. Featured categories
      prisma.category.findMany({
        where: { isActive: true, isFeatured: true, parentId: null },
        select: { id: true, name: true, slug: true, image: true, icon: true },
        orderBy: { displayOrder: "asc" },
        take: 12,
      }),
      // 2. All main categories
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          icon: true,
          isFeatured: true,
        },
        orderBy: { displayOrder: "asc" },
      }),
      // 3. Featured products
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      // 4. Sale products
      prisma.product.findMany({
        where: { isActive: true, isOnSale: true, compareAtPrice: { gt: 0 } },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { salesCount: "desc" },
        take: 12,
      }),
      // 5. New arrivals
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      // 6. Trending products
      prisma.product.findMany({
        where: { isActive: true, isTrending: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: [{ viewCount: "desc" }, { salesCount: "desc" }],
        take: 12,
      }),
      // 7. Baby products
      prisma.product.findMany({
        where: {
          isActive: true,
          ageGroup: { in: ["ZERO_TO_ONE", "ONE_TO_TWO", "TWO_TO_FOUR"] },
        },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      // 8. Winter products
      prisma.product.findMany({
        where: {
          isActive: true,
          categories: {
            some: {
              category: {
                slug: {
                  in: [
                    "winter-wear",
                    "jackets",
                    "sweaters",
                    "hoodies",
                    "sweatshirts",
                  ],
                },
              },
            },
          },
        },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      // 9. Ethnic products
      prisma.product.findMany({
        where: {
          isActive: true,
          categories: {
            some: {
              category: {
                slug: {
                  in: ["ethnic-wear", "traditional", "kurta", "lehenga"],
                },
              },
            },
          },
        },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      // 10. Party wear products
      prisma.product.findMany({
        where: {
          isActive: true,
          categories: {
            some: {
              category: {
                slug: { in: ["party-wear", "formal", "occasion-wear"] },
              },
            },
          },
        },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        featuredCategories,
        allCategories,
        featuredProducts,
        saleProducts,
        newArrivals,
        trendingProducts,
        babyProducts,
        winterProducts,
        ethnicProducts,
        partyWearProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch home page data",
      },
      { status: 500 },
    );
  }
}
