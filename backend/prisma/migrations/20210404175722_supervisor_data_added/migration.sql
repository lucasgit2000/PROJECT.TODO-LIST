-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "supervisor_name" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "supervisor_email" TEXT NOT NULL DEFAULT E'';
