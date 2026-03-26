import { env } from '@/src/core/main/config';
import { FetchHttpClient } from '@/src/web/api/http/fetch/http-client';

export function makeFetchHttpClient() {
  return new FetchHttpClient(env.NEXT_PUBLIC_API_URL);
}
