import { Container } from 'inversify';
import { websocketServerModule } from './serviceIdentifiers';
import { WebsocketServer } from './WebsocketServer';
import { WebsocketServerInterface } from './WebsocketServerInterface';
import { WebsocketChannelClusterInterface } from './WebsocketChannelClusterInterface';
import { WebsocketChannelCluster } from './WebsocketChannelCluster';
import { WebsocketChannel } from './WebsocketChannel';
import { WebsocketChannelInterface } from './WebsocketChannelInterface';

export const websocketServerModuleLoader = (container: Container): void => {
  container
    .bind<WebsocketServerInterface>(websocketServerModule.WebsocketServer)
    .to(WebsocketServer);
  container
    .bind<WebsocketChannelClusterInterface>(
      websocketServerModule.WebsocketChannelCluster,
    )
    .to(WebsocketChannelCluster);
  container
    .bind<WebsocketChannelInterface>(websocketServerModule.WebsocketChannel)
    .to(WebsocketChannel);
};
