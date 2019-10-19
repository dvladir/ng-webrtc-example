export abstract class WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  pingInterval?: number;
}
