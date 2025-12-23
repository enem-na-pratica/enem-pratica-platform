export interface ToModelMapper<I, O> {
  toModel(input: I): O;
}