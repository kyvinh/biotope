-- AlterTable
ALTER TABLE `argument` ADD COLUMN `anonymous` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `creatorId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ArgumentLog` (
    `id` VARCHAR(191) NOT NULL,
    `argumentId` VARCHAR(191) NOT NULL,
    `hashUid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArgumentLog` ADD CONSTRAINT `ArgumentLog_argumentId_fkey` FOREIGN KEY (`argumentId`) REFERENCES `Argument`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
