export interface ToDtoMapper<I, O> {
  toDto(input: I): O;
}