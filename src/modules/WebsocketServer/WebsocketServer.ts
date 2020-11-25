import WebSocket from 'ws';
import { inject, injectable } from 'inversify';
import * as http from 'http';
import * as url from 'url';
import { WebsocketServerInterface } from './WebsocketServerInterface';
import { WebsocketChannelClusterInterface } from './WebsocketChannelClusterInterface';
import { websocketServerModule } from './serviceIdentifiers';
import { Socket } from 'net';

@injectable()
export class WebsocketServer implements WebsocketServerInterface {
  private _wsServer: WebSocket.Server;
  private _server: http.Server;

  constructor(
    @inject(websocketServerModule.WebsocketChannelCluster)
    private _cluster: WebsocketChannelClusterInterface,
  ) {
    this._wsServer = new WebSocket.Server({ noServer: true });
    this._server = http.createServer();
  }

  async open(port: number): Promise<void> {
    this._server.on('upgrade', this._handleWsHandshake.bind(this));
    this._server.listen(port, () => {
      console.log(`WebSocket server opened on port ${port}...`);
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._server.close((err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  private _handleWsHandshake(
    req: http.IncomingMessage,
    socket: Socket,
    head: Buffer,
  ): void {
    const pathname = url.parse(req.url).pathname;
    const channelId = pathname.substr(1);
    this._wsServer.handleUpgrade(req, socket, head, (ws: WebSocket) => {
      this._cluster.addConnection(channelId, ws);
    });
  }
}
