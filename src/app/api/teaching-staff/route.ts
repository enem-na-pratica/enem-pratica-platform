import { NextResponse } from "next/server";
import { makeGetTeachingStaffController } from "@/src/core/main/factories/user/get-teaching-staff.factory";

export async function GET() {
  const getTeachingStaffController = await makeGetTeachingStaffController().handle();

  return NextResponse.json(
    getTeachingStaffController.body,
    { status: getTeachingStaffController.statusCode }
  );
}