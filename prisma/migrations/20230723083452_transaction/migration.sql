/*
  Warnings:

  - You are about to drop the column `paid` on the `bill` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bill` table. All the data in the column will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bill` DROP FOREIGN KEY `Bill_userId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_billId_fkey`;

-- AlterTable
ALTER TABLE `bill` DROP COLUMN `paid`,
    DROP COLUMN `userId`;

-- DropTable
DROP TABLE `payment`;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `bill_id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `account_no` VARCHAR(191) NOT NULL,
    `bank_name` VARCHAR(191) NOT NULL,
    `faculty` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
