/*
  Warnings:

  - Added the required column `content` to the `boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "content" TEXT NOT NULL;
