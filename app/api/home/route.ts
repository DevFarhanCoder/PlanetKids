import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Fetch featured categories
    const featuredCategories = await prisma.category.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        parentId: null, // Only main categories
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        icon: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      take: 12,
    });

    // Fetch all main categories for category sections
    const allCategories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        icon: true,
        isFeatured: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    // Fetch featured products (for boutiques/premium section)
    const featuredProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    // Fetch sale/discounted products
    const saleProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isOnSale: true,
        compareAtPrice: {
          gt: 0,
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        salesCount: 'desc',
      },
      take: 12,
    });

    // Fetch new arrivals
    const newArrivals = await prisma.product.findMany({
      where: {
        isActive: true,
        isNewArrival: true,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    });

    // Fetch trending products
    const trendingProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isTrending: true,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        { viewCount: 'desc' },
        { salesCount: 'desc' },
      ],
      take: 12,
    });

    // Fetch products by age group (for baby/kids sections)
    const babyProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        ageGroup: {
          in: ['ZERO_TO_ONE', 'ONE_TO_TWO', 'TWO_TO_FOUR'],
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    });

    // Fetch products by specific categories (Winter wear, ethnic wear, party wear)
    const winterProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categories: {
          some: {
            category: {
              slug: {
                in: ['winter-wear', 'jackets', 'sweaters', 'hoodies', 'sweatshirts'],
              },
            },
          },
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    });

    const ethnicProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categories: {
          some: {
            category: {
              slug: {
                in: ['ethnic-wear', 'traditional', 'kurta', 'lehenga'],
              },
            },
          },
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    const partyWearProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categories: {
          some: {
            category: {
              slug: {
                in: ['party-wear', 'formal', 'occasion-wear'],
              },
            },
          },
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

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
    console.error('Error fetching home page data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch home page data',
      },
      { status: 500 }
    );
  }
}
