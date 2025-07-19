/*
  Warnings:

  - You are about to drop the column `userId` on the `Indicator` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Indicator` DROP FOREIGN KEY `Indicator_userId_fkey`;

-- DropIndex
DROP INDEX `Indicator_userId_fkey` ON `Indicator`;

-- AlterTable
ALTER TABLE `Indicator` DROP COLUMN `userId`;
