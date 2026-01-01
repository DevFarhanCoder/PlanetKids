-- AlterTable
ALTER TABLE "HomeSectionItem" ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "link" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "HomeSectionItem_categoryId_idx" ON "HomeSectionItem"("categoryId");

-- AddForeignKey
ALTER TABLE "HomeSectionItem" ADD CONSTRAINT "HomeSectionItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
