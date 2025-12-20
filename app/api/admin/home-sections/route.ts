import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all home sections
export async function GET(request: NextRequest) {
  try {
    const sections = await prisma.homeSection.findMany({
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

// POST - Create new home section (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, title, subtitle, sectionType, displayOrder, isActive } = body;

    if (!name || !slug || !title) {
      return NextResponse.json({ error: 'Name, slug, and title are required' }, { status: 400 });
    }

    const section = await prisma.homeSection.create({
      data: {
        name,
        slug,
        title,
        subtitle,
        sectionType: sectionType || 'GRID',
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating home section:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A section with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create home section' }, { status: 500 });
  }
}

// PUT - Update home section (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, slug, title, subtitle, sectionType, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const section = await prisma.homeSection.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(sectionType && { sectionType }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error updating home section:', error);
    return NextResponse.json({ error: 'Failed to update home section' }, { status: 500 });
  }
}

// DELETE - Delete home section (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    await prisma.homeSection.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting home section:', error);
    return NextResponse.json({ error: 'Failed to delete home section' }, { status: 500 });
  }
}
