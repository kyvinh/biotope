/*
  Warnings:

  - A unique constraint covering the columns `[type,invitedEmail,creatorId,cercleId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,invitedId,creatorId,cercleId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invitation_type_invitedEmail_creatorId_cercleId_key` ON `Invitation`(`type`, `invitedEmail`, `creatorId`, `cercleId`);

-- CreateIndex
CREATE UNIQUE INDEX `Invitation_type_invitedId_creatorId_cercleId_key` ON `Invitation`(`type`, `invitedId`, `creatorId`, `cercleId`);
