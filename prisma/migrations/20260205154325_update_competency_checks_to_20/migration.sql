-- Remove the old 40-point constraints
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency1";
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency2";
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency3";
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency4";
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency5";

-- Add the new 20-point constraints
ALTER TABLE "essays" ADD CONSTRAINT "check_competency1" CHECK ("competency1" >= 0 AND "competency1" <= 200 AND "competency1" % 20 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency2" CHECK ("competency2" >= 0 AND "competency2" <= 200 AND "competency2" % 20 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency3" CHECK ("competency3" >= 0 AND "competency3" <= 200 AND "competency3" % 20 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency4" CHECK ("competency4" >= 0 AND "competency4" <= 200 AND "competency4" % 20 = 0);
ALTER TABLE "essays" ADD CONSTRAINT "check_competency5" CHECK ("competency5" >= 0 AND "competency5" <= 200 AND "competency5" % 20 = 0);
