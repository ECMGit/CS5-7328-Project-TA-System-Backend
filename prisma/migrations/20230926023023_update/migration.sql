-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` BIGINT NULL,
    `updatedAt` DATETIME(3) NULL,
    

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_resetToken_key`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Profile` {
    `id` INTEGER NOT NUTLL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `profileImage` IMAGE NULL,
    `graduationYear`  INTEGER NULL,
    `major` VARCHAR(191) NULL,
    `resumeFilePath` VARBINARY(MAX) NULL
}