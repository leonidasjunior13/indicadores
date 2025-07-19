/*
  Warnings:

  - You are about to drop the column `meta` on the `Indicator` table. All the data in the column will be lost.
  - Added the required column `metaFormula` to the `Indicator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metaReference` to the `Indicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Indicator` DROP COLUMN `meta`,
    ADD COLUMN `metaFormula` VARCHAR(191) NOT NULL,
    ADD COLUMN `metaReference` VARCHAR(191) NOT NULL;
