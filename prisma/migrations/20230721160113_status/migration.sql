-- AlterTable
ALTER TABLE `bill` ADD COLUMN `paid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
