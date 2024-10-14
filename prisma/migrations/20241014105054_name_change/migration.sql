/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_name_key" ON "Token"("name");
