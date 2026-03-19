-- Add shippingCharge and isBranded to Product
ALTER TABLE "Product" ADD COLUMN "shippingCharge" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "isBranded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: ProductLink (linked products as variants)
CREATE TABLE "ProductLink" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "linkedProductId" TEXT NOT NULL,
    "label" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductLink_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "ProductLink_productId_linkedProductId_key" ON "ProductLink"("productId", "linkedProductId");

-- CreateIndex
CREATE INDEX "ProductLink_productId_idx" ON "ProductLink"("productId");

-- AddForeignKey
ALTER TABLE "ProductLink" ADD CONSTRAINT "ProductLink_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductLink" ADD CONSTRAINT "ProductLink_linkedProductId_fkey"
    FOREIGN KEY ("linkedProductId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
