/*
  Warnings:

  - You are about to drop the `_pettouser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_pettouser` DROP FOREIGN KEY `_PetToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_pettouser` DROP FOREIGN KEY `_PetToUser_B_fkey`;

-- AlterTable
ALTER TABLE `pet` ADD COLUMN `user_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_pettouser`;

-- AddForeignKey
ALTER TABLE `Pet` ADD CONSTRAINT `Pet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
