/*
  Warnings:

  - The primary key for the `VerificationCode` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_pkey",
ADD CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("code");
