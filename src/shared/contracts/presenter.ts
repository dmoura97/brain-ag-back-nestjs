export interface Presenter {
  httpResponse(): any;
  setData(data: any): void;
}