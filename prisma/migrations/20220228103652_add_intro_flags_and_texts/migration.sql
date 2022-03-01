-- AlterTable
ALTER TABLE `cercle` ADD COLUMN `introConclusion` VARCHAR(2000) NULL,
    ADD COLUMN `introText` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `question` ADD COLUMN `introFlag` BOOLEAN NOT NULL DEFAULT false;
