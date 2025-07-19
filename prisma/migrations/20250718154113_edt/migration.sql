/*
  Warnings:

  - Added the required column `month` to the `IndicatorHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `IndicatorHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `IndicatorHistory` ADD COLUMN `month` VARCHAR(191) NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;
