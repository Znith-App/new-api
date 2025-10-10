/*
  Warnings:

  - You are about to drop the column `sessionDuration` on the `TherapySession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Psychotherapy" ADD COLUMN     "sessionDuration" INTEGER,
ADD COLUMN     "time" TEXT;

-- AlterTable
ALTER TABLE "TherapySession" DROP COLUMN "sessionDuration";
