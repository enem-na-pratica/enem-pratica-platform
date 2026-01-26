import { BcryptAdapter } from "@/src/core/infrastructure/crypto";

export function makeBcryptAdapter() {
  return new BcryptAdapter();
}