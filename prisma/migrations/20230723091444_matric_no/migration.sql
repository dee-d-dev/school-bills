/*
  Warnings:

  - You are about to drop the column `department` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `faculty` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `matric_no` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `department`,
    DROP COLUMN `faculty`,
    ADD COLUMN `matric_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `paid_at` DATETIME(3) NULL;
