-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_boardId_fkey";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
