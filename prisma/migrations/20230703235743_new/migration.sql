/*
  Warnings:

  - You are about to drop the column `Department` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `Faculty` on the `user` table. All the data in the column will be lost.
  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `Department`,
    DROP COLUMN `Faculty`,
    ADD COLUMN `department` VARCHAR(191) NOT NULL,
    ADD COLUMN `faculty` VARCHAR(191) NOT NULL;
