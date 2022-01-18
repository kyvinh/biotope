/*
  Warnings:

  - A unique constraint covering the columns `[type,code,cercleId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `invitation` ADD COLUMN `code` VARCHAR(191) NULL,
    ADD COLUMN `expiration` DATETIME(3) NULL,
    MODIFY `type` ENUM('EMAIL', 'CODE') NOT NULL DEFAULT 'EMAIL';

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_type_code_cercleId_key` ON `Invitation`(`type`, `code`, `cercleId`);
