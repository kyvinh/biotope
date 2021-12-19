-- CreateTable
CREATE TABLE `PossibleAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'NUMBER') NOT NULL DEFAULT 'NUMBER',
    `questionId` VARCHAR(191) NOT NULL,
    `possibleText` VARCHAR(191) NULL,
    `possibleNumber` INTEGER NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `PossibleAnswer_questionId_possibleText_possibleNumber_key`(`questionId`, `possibleText`, `possibleNumber`),
    UNIQUE INDEX `PossibleAnswer_questionId_order_key`(`questionId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PossibleAnswer` ADD CONSTRAINT `PossibleAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
