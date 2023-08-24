/*
  Warnings:

  - Added the required column `admin_id` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bill` ADD COLUMN `admin_id` VARCHAR(191) NOT NULL;
