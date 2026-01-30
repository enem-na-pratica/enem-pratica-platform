"use server"
import { makeEssayService } from "@/src/web/api";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createEssayAction(data: any) {
  await makeEssayService().create(data);

  revalidatePath("/dashboard/essays");
}