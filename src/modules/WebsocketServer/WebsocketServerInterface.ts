export interface WebsocketServerInterface {
  open(port: number): Promise<void>;

  close(): Promise<void>;
}
