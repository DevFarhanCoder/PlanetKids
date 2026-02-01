import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all orders (Admin) or user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const isAdmin = (session.user as any).role === "ADMIN";

    // Get single order
    if (id) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if user owns this order (if not admin)
      if (!isAdmin && order.userId !== (session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      return NextResponse.json(order);
    }

    // Build where clause
    const where: any = {};

    if (!isAdmin) {
      where.userId = (session.user as any).id;
    }

    if (status) {
      where.status = status;
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// POST - Create order (for COD)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      paymentMethod,
      address,
      subtotal,
      shippingCost,
      codCharge,
      tax,
      total,
    } = body;

    if (paymentMethod !== "COD") {
      return NextResponse.json(
        { error: "This endpoint is for COD orders only" },
        { status: 400 },
      );
    }

    // Fetch cart items
    const cart = await prisma.cart.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productSlug: item.product.slug,
      productImage: item.product.images[0]?.url || null,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: Number(item.product.price) * item.quantity,
    }));

    // Create COD order
    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        orderNumber: `ORD${Date.now()}`,
        status: "PENDING",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost),
        codCharge: Number(codCharge),
        tax: Number(tax),
        total: Number(total),
        shippingName: address.name,
        shippingEmail: (session.user as any).email,
        shippingPhone: address.phone,
        shippingAddress: address.address,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPincode: address.pincode,
        shippingCountry: address.country || "India",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

// PUT - Update order status (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, paymentStatus, trackingNumber } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const updateData: any = {};

    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
