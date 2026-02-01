import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      subtotal,
      shippingCost,
      tax,
      total,
    } = body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
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

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        orderNumber: `ORD${Date.now()}`,
        status: "CONFIRMED",
        paymentMethod: "PREPAID",
        paymentStatus: "PAID",
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost),
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
        payment: {
          create: {
            amount: Number(total),
            currency: "INR",
            status: "PAID",
            method: "PREPAID",
            gatewayOrderId: razorpay_order_id,
            gatewayPaymentId: razorpay_payment_id,
            gatewaySignature: razorpay_signature,
            transactionDate: new Date(),
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
