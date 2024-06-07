-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profilePic" SET DEFAULT '';
