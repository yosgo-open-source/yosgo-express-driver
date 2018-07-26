import { Handler, Express } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { CoreRouter } from 'coreRouter';

type CoreContext = {
  middlewares?: Array<Handler>;
  apiPath?: string;
};

type CoreListenOptions = {
  port: number | string;
  apiPath: string;
  success({ port }: { port: number | string }): any;
};

export default class Core {
  middlewares: Array<Handler>;
  private instance: Express;

  private createInstance(): Express;

  public init(ctx?: CoreContext): void;

  public routerHandler(router: CoreRouter): void;

  public listen(options: CoreListenOptions): Server;
}
