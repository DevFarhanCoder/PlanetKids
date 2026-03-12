-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('URL', 'UPLOAD');

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnail" TEXT,
    "duration" TEXT,
    "videoType" "VideoType" NOT NULL DEFAULT 'URL',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Video_isActive_isFeatured_idx" ON "Video"("isActive", "isFeatured");

-- CreateIndex
CREATE INDEX "Video_displayOrder_idx" ON "Video"("displayOrder");
