-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE `Bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `account_no` VARCHAR(191) NOT NULL,
    `bank_name` VARCHAR(191) NOT NULL,
    `faculty` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
