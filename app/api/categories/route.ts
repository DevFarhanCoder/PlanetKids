import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const parentOnly = searchParams.get("parentOnly") === "true";

    // Get single category
    if (id || slug) {
      const category = await prisma.category.findUnique({
        where: id ? { id } : { slug: slug! },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
          },
          parent: true,
          products: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { order: "asc" },
                  },
                },
              },
            },
            take: 10,
          },
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(category);
    }

    // Get all categories
    const where: any = { isActive: true };

    if (parentOnly) {
      where.parentId = null;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
        parent: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// POST - Create category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const parentId = (formData.get("parentId") as string) || null;
    const displayOrder = parseInt(
      (formData.get("displayOrder") as string) || "0",
    );
    const isFeatured = formData.get("isFeatured") === "true";

    // Handle image upload
    let imageUrl = null;
    const image = formData.get("image") as File;

    if (image && image.size > 0) {
      const uploadDir = join(process.cwd(), "public", "uploads", "categories");

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/uploads/categories/${filename}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        image: imageUrl,
        parentId,
        displayOrder,
        isFeatured,
      },
      include: {
        children: true,
        parent: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}

// PUT - Update category (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");
    let id: string;
    let updateData: any = {};

    // Handle both JSON and FormData
    if (contentType?.includes("application/json")) {
      const { searchParams } = new URL(request.url);
      id = searchParams.get("id") || "";
      const body = await request.json();

      if (body.name) updateData.name = body.name;
      if (body.slug) updateData.slug = body.slug;
      if (body.description !== undefined)
        updateData.description = body.description;
      if (body.icon !== undefined) updateData.icon = body.icon;
      if (body.parentId !== undefined)
        updateData.parentId = body.parentId || null;
      if (body.displayOrder !== undefined)
        updateData.displayOrder = parseInt(body.displayOrder);
      if (body.isFeatured !== undefined)
        updateData.isFeatured = body.isFeatured;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
    } else {
      // Handle FormData
      const formData = await request.formData();
      id = formData.get("id") as string;

      if (formData.has("name")) updateData.name = formData.get("name");
      if (formData.has("slug")) updateData.slug = formData.get("slug");
      if (formData.has("description"))
        updateData.description = formData.get("description");
      if (formData.has("icon")) updateData.icon = formData.get("icon");
      if (formData.has("parentId"))
        updateData.parentId = formData.get("parentId") || null;
      if (formData.has("displayOrder"))
        updateData.displayOrder = parseInt(
          formData.get("displayOrder") as string,
        );
      if (formData.has("isFeatured"))
        updateData.isFeatured = formData.get("isFeatured") === "true";
      if (formData.has("isActive"))
        updateData.isActive = formData.get("isActive") === "true";

      // Handle new image
      const image = formData.get("image") as File;
      if (image && image.size > 0) {
        const uploadDir = join(
          process.cwd(),
          "public",
          "uploads",
          "categories",
        );
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        updateData.image = `/uploads/categories/${filename}`;
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Category ID required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        children: true,
        parent: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

// DELETE - Delete category (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID required" },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
