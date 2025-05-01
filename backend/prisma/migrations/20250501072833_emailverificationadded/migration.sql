-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarLocalPath" DROP NOT NULL,
ALTER COLUMN "emailVerificationTokenExpiry" DROP NOT NULL;
