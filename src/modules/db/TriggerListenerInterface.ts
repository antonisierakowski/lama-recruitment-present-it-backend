export interface TriggerListenerInterface {
  connectAndStartListening(): Promise<void>;

  closeConnection(): void;
}
