export interface Validation {
  validate<T>(data: T): Error | void;
}
