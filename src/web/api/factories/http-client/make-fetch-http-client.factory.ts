import { FetchHttpClient } from "@/src/web/api/http/fetch/http-client";


export function makeFetchHttpClient() {
  return new FetchHttpClient();
}