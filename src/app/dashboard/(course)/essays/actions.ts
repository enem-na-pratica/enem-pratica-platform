"use server"
import { makeEssayService } from "@/src/services/api/factories";
import { revalidatePath } from "next/cache";

export async function createEssayAction(data: unknown) {
  await makeEssayService().create(data);

  revalidatePath("/dashboard/essays");
}