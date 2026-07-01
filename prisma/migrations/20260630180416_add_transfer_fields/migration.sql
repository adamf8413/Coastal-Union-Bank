-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "accountName" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "bankAddress" TEXT;
ALTER TABLE "Transaction" ADD COLUMN "transferType" TEXT DEFAULT 'local';
