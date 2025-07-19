/*
  Warnings:

  - Added the required column `meta` to the `Indicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Indicator` ADD COLUMN `meta` VARCHAR(191) NOT NULL;
