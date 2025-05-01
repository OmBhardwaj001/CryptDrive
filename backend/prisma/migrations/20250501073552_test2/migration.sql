/*
  Warnings:

  - You are about to drop the column `accountLockedTill` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `failedLoginAttempts` on the `User` table. All the data in the column will be lost.
  - The `passwordResetExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `emailVerificationTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountLockedTill",
DROP COLUMN "failedLoginAttempts",
DROP COLUMN "passwordResetExpiry",
ADD COLUMN     "passwordResetExpiry" TIMESTAMP(3),
DROP COLUMN "emailVerificationTokenExpiry",
ADD COLUMN     "emailVerificationTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "refreshToken" DROP NOT NULL;
