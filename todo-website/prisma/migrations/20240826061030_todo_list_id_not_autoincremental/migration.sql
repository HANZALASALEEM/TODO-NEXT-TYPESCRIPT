/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `TodoList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TodoList" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "TodoList_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "TodoList_id_key" ON "TodoList"("id");
