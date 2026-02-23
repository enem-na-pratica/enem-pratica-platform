-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('COMPREHENDED', 'PRACTICE', 'REVIEW');

-- CreateTable
CREATE TABLE "user_topic_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "status" "TopicStatus" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_topic_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_topic_progress_userId_topicId_key" ON "user_topic_progress"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "user_topic_progress" ADD CONSTRAINT "user_topic_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_topic_progress" ADD CONSTRAINT "user_topic_progress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
