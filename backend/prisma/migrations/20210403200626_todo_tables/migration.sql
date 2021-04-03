-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskStatuses" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_statusId_unique" ON "Task"("statusId");

-- AddForeignKey
ALTER TABLE "Task" ADD FOREIGN KEY ("statusId") REFERENCES "TaskStatuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
