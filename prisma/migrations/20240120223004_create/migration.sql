/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_number_key" ON "sessions"("number");
