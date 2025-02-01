-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "slug" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isAdmin" SET DEFAULT false;
