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

-- Validação das 5 competências: entre 0 e 200 e múltiplo de 40
ALTER TABLE "essays" ADD CONSTRAINT "check_competency1" CHECK ("competency1" >= 0 AND "competency1" <= 200 AND "competency1" % 40 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency2" CHECK ("competency2" >= 0 AND "competency2" <= 200 AND "competency2" % 40 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency3" CHECK ("competency3" >= 0 AND "competency3" <= 200 AND "competency3" % 40 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency4" CHECK ("competency4" >= 0 AND "competency4" <= 200 AND "competency4" % 40 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency5" CHECK ("competency5" >= 0 AND "competency5" <= 200 AND "competency5" % 40 = 0);