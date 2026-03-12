-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isReturnable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "returnPolicyNote" TEXT;
