"use server"
import { makeEssayService } from "@/src/services/api/factories";
import { revalidatePath } from "next/cache";

export async function createEssayAction(data: unknown) {
  console.log("Ação de criação de essay recebida com dados:", data);
  await makeEssayService().create(data);

  revalidatePath("/dashboard/essays");
}