export interface Mapper<I, O> {
  map(input: I): O;
}
