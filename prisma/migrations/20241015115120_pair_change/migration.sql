/*
  Warnings:

  - Made the column `pair` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "pair" SET NOT NULL;
-- DROP TABLE "Token" CASCADE;
