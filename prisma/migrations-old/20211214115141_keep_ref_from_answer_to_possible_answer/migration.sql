/*
  Warnings:

  - You are about to drop the column `answerNum` on the `answer` table. All the data in the column will be lost.
  - You are about to drop the column `answerText` on the `answer` table. All the data in the column will be lost.
  - Added the required column `possibleAnswerId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `answer` DROP COLUMN `answerNum`,
    DROP COLUMN `answerText`,
    ADD COLUMN `possibleAnswerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_possibleAnswerId_fkey` FOREIGN KEY (`possibleAnswerId`) REFERENCES `PossibleAnswer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
