-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('BINANCE', 'BYBIT', 'MEXC', 'BITGET', 'BINGX', 'OKX');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "exchange" "Exchange";
