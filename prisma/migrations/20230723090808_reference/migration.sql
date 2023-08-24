/*
  Warnings:

  - You are about to drop the column `updated_at` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `reference` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `updated_at`,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('pending', 'overdue', 'paid') NOT NULL DEFAULT 'pending';
