/*
  Warnings:

  - You are about to drop the column `timesUpdated` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "timesUpdated",
ADD COLUMN     "timesUpdatedToPending" INTEGER NOT NULL DEFAULT 0;
