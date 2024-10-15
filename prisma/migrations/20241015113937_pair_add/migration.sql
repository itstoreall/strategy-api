/*
  Warnings:

  - A unique constraint covering the columns `[pair]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "pair" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Token_pair_key" ON "Token"("pair");
