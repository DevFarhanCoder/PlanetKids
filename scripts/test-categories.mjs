import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
try {
  const count = await prisma.category.count();
  console.log("Category count:", count);
  const cats = await prisma.category.findMany({
    take: 2,
    include: {
      children: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
      parent: true,
      _count: { select: { products: true } },
    },
    orderBy: { displayOrder: "asc" },
  });
  console.log(
    "Sample:",
    JSON.stringify(cats.map((c) => ({ name: c.name, count: c._count }))),
  );
} catch (e) {
  console.error("DB Error:", e.message);
} finally {
  await prisma.$disconnect();
}
