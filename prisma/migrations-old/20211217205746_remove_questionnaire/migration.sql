# noinspection SqlResolveForFile

/*
  Warnings:

  - You are about to drop the column `questionnaireId` on the `question` table. All the data in the column will be lost.
  - You are about to drop the `questionnaire` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cercleId,name]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cercleId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `Question_questionnaireId_fkey`;

-- DropForeignKey
ALTER TABLE `questionnaire` DROP FOREIGN KEY `Questionnaire_cercleId_fkey`;

-- DropForeignKey
ALTER TABLE `questionnaire` DROP FOREIGN KEY `Questionnaire_creatorId_fkey`;

-- DropIndex
DROP INDEX `Question_questionnaireId_name_key` ON `question`;

-- AlterTable
ALTER TABLE `question` DROP COLUMN `questionnaireId`,
    ADD COLUMN `cercleId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `questionnaire`;

-- CreateIndex
CREATE UNIQUE INDEX `Question_cercleId_name_key` ON `Question`(`cercleId`, `name`);

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_cercleId_fkey` FOREIGN KEY (`cercleId`) REFERENCES `Cercle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
