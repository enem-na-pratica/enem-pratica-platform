import {
  Controller,
  ErrorResponse,
  HttpResponse
} from '@/src/core/presentation/interfaces';
import { GetTeachingStaff } from "@/src/core/application/interfaces/user/get-teaching-staff-use-case.interface";
import { TeachingStaffOptionResDto } from "@/src/core/application/dtos/user";

export type GetTeachingStaffDep = {
  getTeachingStaffUseCase: GetTeachingStaff;
}

export class GetTeachingStaffController
  implements Controller<void, TeachingStaffOptionResDto[]> {
  private readonly getTeachingStaffUseCase: GetTeachingStaff;

  constructor(deps: GetTeachingStaffDep) {
    this.getTeachingStaffUseCase = deps.getTeachingStaffUseCase;
  }

  async handle(): Promise<HttpResponse<TeachingStaffOptionResDto[] | ErrorResponse>> {
    try {
      const teachingStaff = await this.getTeachingStaffUseCase.execute();

      return {
        statusCode: 200,
        body: teachingStaff,
      };
    } catch (err) {
      const error = err as Error;
      return {
        statusCode: 500,
        body: { message: error.message || "Erro inesperado." },
      };
    }
  }
}