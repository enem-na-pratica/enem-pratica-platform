export interface Mapper<TResponse, TModel> {
  toModel(raw: TResponse): TModel;
}