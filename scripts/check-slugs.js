const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.category
  .findMany({ select: { slug: true, name: true, parentId: true } })
  .then((r) => {
    console.log("All categories:");
    r.forEach((c) =>
      console.log(
        `  [${c.parentId ? "child" : "parent"}] ${c.slug} — ${c.name}`,
      ),
    );
  })
  .finally(() => p.$disconnect());
