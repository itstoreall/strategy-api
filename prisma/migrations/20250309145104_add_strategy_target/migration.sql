/*
  Warnings:

  - You are about to drop the column `target` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "target";

-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "target" INTEGER NOT NULL DEFAULT 100;
