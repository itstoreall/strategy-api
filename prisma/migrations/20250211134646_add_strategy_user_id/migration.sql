/*
  Warnings:

  - Added the required column `userId` to the `Strategy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "userId" TEXT NOT NULL;
