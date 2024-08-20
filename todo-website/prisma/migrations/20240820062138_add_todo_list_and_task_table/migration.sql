-- CreateTable
CREATE TABLE "todolist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "todolist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "date" TEXT,
    "todolist_id" INTEGER NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "todolist_user_id_key" ON "todolist"("user_id");

-- AddForeignKey
ALTER TABLE "todolist" ADD CONSTRAINT "todolist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_todolist_id_fkey" FOREIGN KEY ("todolist_id") REFERENCES "todolist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
