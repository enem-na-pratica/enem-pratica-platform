-- ##########################################################################
-- ARQUIVO DE REFERÊNCIA: REGRAS DE NEGÓCIO (SQL PURO)
-- Este arquivo reflete o estado atual das constraints manuais do banco.
-- Use este código como base para criar novas migrations ou para consulta.
-- ##########################################################################

-- ==========================================================================
-- TABELA: essays (Redações)
-- Contexto: Validação das notas por competência.
-- Regra Atual: Valor entre 0 e 200, deve ser múltiplo de 20 (ex: 0, 20, 40... 200).
-- Atualizado em: Migration 20260205154325
-- ==========================================================================

-- Competência 1
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency1";
ALTER TABLE "essays" ADD CONSTRAINT "check_competency1" 
    CHECK ("competency1" >= 0 AND "competency1" <= 200 AND "competency1" % 20 = 0);

-- Competência 2
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency2";
ALTER TABLE "essays" ADD CONSTRAINT "check_competency2" 
    CHECK ("competency2" >= 0 AND "competency2" <= 200 AND "competency2" % 20 = 0);

-- Competência 3
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency3";
ALTER TABLE "essays" ADD CONSTRAINT "check_competency3" 
    CHECK ("competency3" >= 0 AND "competency3" <= 200 AND "competency3" % 20 = 0);

-- Competência 4
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency4";
ALTER TABLE "essays" ADD CONSTRAINT "check_competency4" 
    CHECK ("competency4" >= 0 AND "competency4" <= 200 AND "competency4" % 20 = 0);

-- Competência 5
ALTER TABLE "essays" DROP CONSTRAINT IF EXISTS "check_competency5";
ALTER TABLE "essays" ADD CONSTRAINT "check_competency5" 
    CHECK ("competency5" >= 0 AND "competency5" <= 200 AND "competency5" % 20 = 0);


-- ==========================================================================
-- TABELA: area_performances (Desempenho por Área)
-- Contexto: Validação da contagem de questões (Total de 45 questões por área no ENEM).
-- Regra Atual: Valores devem estar entre 0 e 45.
-- Criado em: Migration 20260205211837
-- ==========================================================================

-- Remove old constraints, if they exist
ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_correct_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_certainty_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_doubt_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_distraction_count";

ALTER TABLE "area_performances"
DROP CONSTRAINT IF EXISTS "check_interpretation_count";

-- Total Correct Answers
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_correct_count" 
CHECK ("correctCount" BETWEEN 0 AND 45);

-- Correct Answers with Certainty
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_certainty_count" 
CHECK ("certaintyCount" BETWEEN 0 AND 45);

-- Doubt, but Answered Correctly
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_doubt_hits" 
CHECK ("doubtHits" BETWEEN 0 AND 45);

-- Doubt, and Answered Incorrectly
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_doubt_errors" 
CHECK ("doubtErrors" BETWEEN 0 AND 45);

-- Wrong Due to Distraction
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_distraction_errors" 
CHECK ("distractionErrors" BETWEEN 0 AND 45);

-- Wrong Due to Misinterpretation
ALTER TABLE "area_performances" 
ADD CONSTRAINT "check_interpretation_errors" 
CHECK ("interpretationErrors" BETWEEN 0 AND 45);