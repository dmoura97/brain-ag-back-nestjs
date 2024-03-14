export interface Mapper {
  toDatabaseSchema(payload: any): any;
}
