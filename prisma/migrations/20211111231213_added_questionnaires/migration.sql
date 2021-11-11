-- CreateTable
CREATE TABLE `Questionnaire` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `creatorId` VARCHAR(191) NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `welcomeText` VARCHAR(191) NULL,
    `cercleId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Questionnaire_cercleId_name_key`(`cercleId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'LONGTEXT', 'LIKERT') NOT NULL DEFAULT 'TEXT',
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `questionnaireId` VARCHAR(191) NOT NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Question_questionnaireId_name_key`(`questionnaireId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Questionnaire` ADD CONSTRAINT `Questionnaire_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questionnaire` ADD CONSTRAINT `Questionnaire_cercleId_fkey` FOREIGN KEY (`cercleId`) REFERENCES `Cercle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_questionnaireId_fkey` FOREIGN KEY (`questionnaireId`) REFERENCES `Questionnaire`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
