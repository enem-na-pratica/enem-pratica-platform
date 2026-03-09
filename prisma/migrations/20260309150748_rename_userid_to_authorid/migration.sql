-- 1. Renomeia as colunas em vez de apagar/criar
ALTER TABLE "question_sessions" RENAME COLUMN "userId" TO "authorId";
ALTER TABLE "user_topic_progress" RENAME COLUMN "userId" TO "authorId";

-- 2. Renomeia o Índice Único (para manter o padrão do novo schema)
ALTER INDEX "user_topic_progress_userId_topicId_key" RENAME TO "user_topic_progress_authorId_topicId_key";

-- 3. Renomeia as Foreign Keys (Constraints)
ALTER TABLE "question_sessions" RENAME CONSTRAINT "question_sessions_userId_fkey" TO "question_sessions_authorId_fkey";
ALTER TABLE "user_topic_progress" RENAME CONSTRAINT "user_topic_progress_userId_fkey" TO "user_topic_progress_authorId_fkey";