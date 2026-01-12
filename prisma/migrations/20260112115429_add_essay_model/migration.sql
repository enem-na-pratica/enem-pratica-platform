-- CreateTable
CREATE TABLE "essays" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "competency1" INTEGER NOT NULL,
    "competency2" INTEGER NOT NULL,
    "competency3" INTEGER NOT NULL,
    "competency4" INTEGER NOT NULL,
    "competency5" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "essays_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "essays" ADD CONSTRAINT "essays_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
