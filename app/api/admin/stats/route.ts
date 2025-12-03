import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get statistics
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' }
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({
        where: {
          trackInventory: true,
          quantity: { lte: prisma.product.fields.lowStockThreshold }
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
        lowStockProducts
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
