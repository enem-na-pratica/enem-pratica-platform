import { makeFetchHttpClient } from "@/src/web/api/factories/http-client";
import { EssayService } from "@/src/web/api/modules/essay";

export function makeEssayService() {
  return new EssayService({
    httpClient: makeFetchHttpClient(),
  });
}
