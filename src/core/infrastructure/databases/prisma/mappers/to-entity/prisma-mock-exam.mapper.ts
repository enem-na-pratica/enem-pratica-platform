import type { PrismaMockExamFull } from "@/src/core/infrastructure/databases/prisma/types";
import type { Mapper } from "@/src/core/domain/contracts/mappers";
import {
  type KnowledgeAreaLabelKey,
  KNOWLEDGE_AREA_MAP,
  MockExam
} from "@/src/core/domain/entities";

export class MockExamEntityMapper implements Mapper<PrismaMockExamFull, MockExam> {
  public map(input: PrismaMockExamFull): MockExam {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const performancesMap: any = {};
    (Object.entries(KNOWLEDGE_AREA_MAP) as [KnowledgeAreaLabelKey, string][]).forEach(
      ([key, areaEnum]) => {
        const performanceData = input.performances.find(p => p.area === areaEnum);

        if (!performanceData) {
          throw new Error(`Critical Data Consistency Error: Performance for area ${areaEnum} not found in Database.`);
        }

        performancesMap[key] = {
          id: performanceData.id,
          correctCount: performanceData.correctCount,
          certaintyCount: performanceData.certaintyCount,
          doubtErrors: performanceData.doubtErrors,
          distractionErrors: performanceData.distractionErrors,
          interpretationErrors: performanceData.interpretationErrors,
        };
      }
    );

    return MockExam.load({
      id: input.id,
      authorId: input.authorId,
      title: input.title,
      createdAt: input.createdAt,
      performances: performancesMap,
    });
  }
}