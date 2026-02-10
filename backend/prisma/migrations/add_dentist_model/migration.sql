-- Migration: Add Dentist Model
-- Created at: 2026-02-09

-- Create Dentists table
CREATE TABLE `dentists` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `cro` VARCHAR(20) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `specialty` VARCHAR(100) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    
    UNIQUE INDEX `dentists_cro_key`(`cro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add dentist_id column to budgets table
ALTER TABLE `budgets` ADD COLUMN `dentist_id` INT NULL;

-- Add foreign key constraint
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_dentist_id_fkey` 
    FOREIGN KEY (`dentist_id`) REFERENCES `dentists`(`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Create index for better performance
CREATE INDEX `budgets_dentist_id_idx` ON `budgets`(`dentist_id`);
