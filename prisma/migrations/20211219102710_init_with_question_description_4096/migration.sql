/*
  Warnings:

  - You are about to alter the column `description` on the `question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4096)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `question` MODIFY `description` VARCHAR(191) NULL;
