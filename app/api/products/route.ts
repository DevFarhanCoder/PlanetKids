import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET all products or single product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const newArrivals = searchParams.get('newArrivals');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get single product by ID or slug
    if (id || slug) {
      const product = await prisma.product.findUnique({
        where: id ? { id } : { slug: slug! },
        include: {
          categories: {
            include: {
              category: true
            }
          },
          images: {
            orderBy: { order: 'asc' }
          },
          variants: true,
          reviews: {
            include: {
              user: {
                select: { name: true, image: true }
              }
            },
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(product);
    }

    // Build filter conditions
    const where: any = { isActive: true };

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (newArrivals === 'true') {
      where.isNewArrival = true;
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true
            }
          },
          images: {
            orderBy: { order: 'asc' },
            take: 1
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    console.log('Form data received:', Object.fromEntries(formData));
    
    // Extract product data
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const price = parseFloat(formData.get('price') as string);
    const compareAtPrice = formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : null;
    const sku = formData.get('sku') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const brand = formData.get('brand') as string;
    const ageGroup = formData.get('ageGroup') as string;
    const categoryIds = JSON.parse(formData.get('categoryIds') as string || '[]');
    const isFeatured = formData.get('isFeatured') === 'true';
    const isNewArrival = formData.get('isNewArrival') === 'true';

    // Handle image uploads
    const images = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    // Check if Cloudinary is configured
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

    if (images && images.length > 0) {
      if (hasCloudinary) {
        // Use Cloudinary for both local and production
        console.log('Uploading images to Cloudinary...');
        for (const image of images) {
          if (image && image.size > 0) {
            try {
              const buffer = Buffer.from(await image.arrayBuffer());
              const url = await uploadToCloudinary(buffer, 'planetkids/products');
              imageUrls.push(url);
              console.log('Image uploaded to Cloudinary:', url);
            } catch (error) {
              console.error('Failed to upload image to Cloudinary:', error);
            }
          }
        }
      } else {
        // Fallback to local filesystem (development only)
        console.warn('Cloudinary not configured. Using local filesystem.');
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
        
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        for (const image of images) {
          if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `${Date.now()}-${image.name.replace(/\s/g, '-')}`;
            const filepath = join(uploadDir, filename);
            
            await writeFile(filepath, buffer);
            imageUrls.push(`/uploads/products/${filename}`);
          }
        }
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        compareAtPrice,
        sku,
        quantity,
        brand,
        ageGroup: ageGroup as any,
        isFeatured,
        isNewArrival,
        isActive: true, // Make product active by default
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            categoryId
          }))
        },
        images: {
          create: imageUrls.map((url, index) => ({
            url,
            altText: name,
            order: index
          }))
        }
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        images: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PUT - Update product (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Extract product data
    const updateData: any = {};
    
    if (formData.has('name')) updateData.name = formData.get('name');
    if (formData.has('slug')) updateData.slug = formData.get('slug');
    if (formData.has('description')) updateData.description = formData.get('description');
    if (formData.has('shortDescription')) updateData.shortDescription = formData.get('shortDescription');
    if (formData.has('price')) updateData.price = parseFloat(formData.get('price') as string);
    if (formData.has('compareAtPrice')) updateData.compareAtPrice = parseFloat(formData.get('compareAtPrice') as string);
    if (formData.has('sku')) updateData.sku = formData.get('sku');
    if (formData.has('quantity')) updateData.quantity = parseInt(formData.get('quantity') as string);
    if (formData.has('brand')) updateData.brand = formData.get('brand');
    if (formData.has('ageGroup')) updateData.ageGroup = formData.get('ageGroup');
    if (formData.has('isFeatured')) updateData.isFeatured = formData.get('isFeatured') === 'true';
    if (formData.has('isNewArrival')) updateData.isNewArrival = formData.get('isNewArrival') === 'true';
    if (formData.has('isActive')) updateData.isActive = formData.get('isActive') === 'true';

    // Handle new images
    const images = formData.getAll('images') as File[];
    if (images && images.length > 0) {
      const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                            process.env.CLOUDINARY_API_KEY && 
                            process.env.CLOUDINARY_API_SECRET;
      const imageUrls: string[] = [];

      if (hasCloudinary) {
        // Upload to Cloudinary
        for (const image of images) {
          if (image && image.size > 0) {
            try {
              const buffer = Buffer.from(await image.arrayBuffer());
              const url = await uploadToCloudinary(buffer, 'planetkids/products');
              imageUrls.push(url);
            } catch (error) {
              console.error('Failed to upload image to Cloudinary:', error);
            }
          }
        }
      } else {
        // Fallback to local filesystem
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
        
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        for (const image of images) {
          if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `${Date.now()}-${image.name.replace(/\s/g, '-')}`;
            const filepath = join(uploadDir, filename);
            
            await writeFile(filepath, buffer);
            imageUrls.push(`/uploads/products/${filename}`);
          }
        }
      }

      if (imageUrls.length > 0) {
        updateData.images = {
          create: imageUrls.map((url, index) => ({
            url,
            altText: updateData.name || '',
            order: index
          }))
        };
      }
    }

    // Handle category updates
    if (formData.has('categoryIds')) {
      const categoryIds = JSON.parse(formData.get('categoryIds') as string);
      
      // Delete existing categories and create new ones
      await prisma.productCategory.deleteMany({
        where: { productId: id }
      });

      updateData.categories = {
        create: categoryIds.map((categoryId: string) => ({
          categoryId
        }))
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categories: {
          include: {
            category: true
          }
        },
        images: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
