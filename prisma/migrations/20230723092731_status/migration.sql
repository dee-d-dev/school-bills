/*
  Warnings:

  - The values [paid] on the enum `Transaction_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `status` ENUM('pending', 'overdue', 'success') NOT NULL DEFAULT 'pending';
