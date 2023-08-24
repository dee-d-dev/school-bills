/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `bill` MODIFY `faculty` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `department` VARCHAR(191) NULL,
    MODIFY `faculty` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
