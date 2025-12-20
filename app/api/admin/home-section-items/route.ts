import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET items for a section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const items = await prisma.homeSectionItem.findMany({
      where: { sectionId },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching section items:', error);
    return NextResponse.json({ error: 'Failed to fetch section items' }, { status: 500 });
  }
}

// POST - Create new item (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const sectionId = formData.get('sectionId') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const badge = formData.get('badge') as string;
    const discount = formData.get('discount') as string;
    const displayOrder = parseInt(formData.get('displayOrder') as string || '0');
    const isActive = formData.get('isActive') === 'true';

    if (!sectionId || !title || !link) {
      return NextResponse.json({ error: 'Section ID, title, and link are required' }, { status: 400 });
    }

    // Handle image upload
    let imageUrl = '';
    const image = formData.get('image') as File;
    
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'home-sections');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/home-sections/${filename}`;
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const item = await prisma.homeSectionItem.create({
      data: {
        sectionId,
        title,
        subtitle: subtitle || null,
        image: imageUrl,
        link,
        badge: badge || null,
        discount: discount || null,
        displayOrder,
        isActive
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating section item:', error);
    return NextResponse.json({ error: 'Failed to create section item' }, { status: 500 });
  }
}

// PUT - Update item (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const badge = formData.get('badge') as string;
    const discount = formData.get('discount') as string;
    const displayOrder = formData.get('displayOrder') ? parseInt(formData.get('displayOrder') as string) : undefined;
    const isActive = formData.get('isActive') ? formData.get('isActive') === 'true' : undefined;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Handle image upload if new image provided
    let imageUrl: string | undefined;
    const image = formData.get('image') as File;
    
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'home-sections');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = join(uploadsDir, filename);
      
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/home-sections/${filename}`;
    }

    const item = await prisma.homeSectionItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle: subtitle || null }),
        ...(imageUrl && { image: imageUrl }),
        ...(link && { link }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(discount !== undefined && { discount: discount || null }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating section item:', error);
    return NextResponse.json({ error: 'Failed to update section item' }, { status: 500 });
  }
}

// DELETE - Delete item (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.homeSectionItem.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting section item:', error);
    return NextResponse.json({ error: 'Failed to delete section item' }, { status: 500 });
  }
}
