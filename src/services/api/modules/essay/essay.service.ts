import { HttpClient } from '@/src/services/api/common/http/http-client.interface';
import { Mapper } from "@/src/services/api/common/interfaces/mapper.interface";
import { EssayResponseDto } from "@/src/services/api/dtos";
import { EssayModel } from "@/src/services/api/models";
import { EssayServiceHttp } from './essay.service.interface';

type EssayServiceDeps = {
  httpClient: HttpClient,
  mapper: Mapper<EssayResponseDto, EssayModel>
}

export class EssayService implements EssayServiceHttp {
  private readonly httpClient: HttpClient;
  private readonly mapper: Mapper<EssayResponseDto, EssayModel>;

  constructor(deps: EssayServiceDeps) {
    this.httpClient = deps.httpClient;
    this.mapper = deps.mapper;
  }

  async create(dataEssay: unknown): Promise<EssayModel> {
    const data = await this.httpClient.post<EssayResponseDto>(
      "/essays/new",
      { data: dataEssay }
    );

    return this.mapper.toModel(data);
  }
}