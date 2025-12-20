import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // If slug is provided, return specific section
    if (slug) {
      const section = await prisma.homeSection.findFirst({
        where: { 
          slug,
          isActive: true 
        },
        include: {
          items: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      if (!section) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
      }

      return NextResponse.json({ sections: [section] });
    }

    // Otherwise, return all active sections
    const sections = await prisma.homeSection.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching home sections:', error);
    return NextResponse.json({ error: 'Failed to fetch home sections' }, { status: 500 });
  }
}
