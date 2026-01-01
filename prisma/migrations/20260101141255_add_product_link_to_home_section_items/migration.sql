-- AlterTable
ALTER TABLE "HomeSectionItem" ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "HomeSectionItem_productId_idx" ON "HomeSectionItem"("productId");

-- AddForeignKey
ALTER TABLE "HomeSectionItem" ADD CONSTRAINT "HomeSectionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
