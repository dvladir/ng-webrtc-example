export interface WsMessage<T> {
  event: string;
  data: T;
}
