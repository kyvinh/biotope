/*
  Warnings:

  - A unique constraint covering the columns `[type,code]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `account` ADD COLUMN `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `reputationaction` MODIFY `actionType` ENUM('REGISTER_EMAIL', 'REGISTER_CODE', 'REGISTER_IRL', 'REGISTER_POSTAL', 'HAS_REGISTERED_IRL', 'SEND_INVITE', 'ANSWER_QUESTION', 'ARGUMENT_ANSWER', 'CREATE_ANSWER', 'UPVOTE_ARGUMENT', 'FLAG_ARGUMENT', 'EDIT_ARGUMENT') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `invitation` ADD COLUMN `code` VARCHAR(191) NULL,
                         ADD COLUMN `expiration` DATETIME(3) NULL,
                         MODIFY `type` ENUM('EMAIL', 'CODE') NOT NULL DEFAULT 'EMAIL';

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_type_code_key` ON `Invitation`(`type`, `code`);