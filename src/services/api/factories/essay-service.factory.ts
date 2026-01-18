import { fetchHttpClient } from "@/src/services/api/factories/http-client/fetch-http-client.factory";
import { EssayMapper } from "@/src/services/api/mappers";
import { EssayService } from "@/src/services/api/modules/essay/essay.service";

export function makeEssayService() {
  const mapper = new EssayMapper();
  return new EssayService({
    httpClient: fetchHttpClient,
    mapper
  });
}
