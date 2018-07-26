import express, { Request, Response, Handler, Express, Router } from 'express';
import { Server } from 'http';
import { CoreContext, CoreListenOptions } from 'core';
import { CoreRouter, CoreResponseType } from 'coreRouter';
import { ResponseStatusHandler } from './coreStatusHandler';

export default class Core {
  middlewares: Array<Handler>;
  private instance: express.Express;
  private apiPath: string;

  constructor() {
    this.instance = null;
    this.apiPath = 'api';
    this.middlewares = [];
  }

  private createInstance(): Express {
    if (!this.instance) {
      return (this.instance = express());
    }
    return this.instance;
  }

  public init(ctx?: CoreContext): void {
    this.instance = this.createInstance();

    // default response middleware
    this.instance.use((req: Request, res: CoreResponseType, next) => {
      res.responseStatusHandler = new ResponseStatusHandler(res);
      next();
    });

    if (ctx) {
      if (ctx.middlewares) {
        ctx.middlewares.forEach((middleware: Handler) =>
          this.instance.use(middleware)
        );
      }
      if (ctx.apiPath) {
        this.apiPath = ctx.apiPath;
      }
    }
  }

  public routerHandler(handler: CoreRouter | any): void {
    const restfulPack: Array<{ method: string; fn: string }> = [
      {
        method: 'post',
        fn: 'create'
      },
      {
        method: 'get',
        fn: 'read'
      },
      {
        method: 'put',
        fn: 'update'
      },
      {
        method: 'delete',
        fn: 'delete'
      }
    ];
    const routers: any = express.Router();
    const path = handler.path;
    delete handler.path;
    for (let key in handler) {
      if (key === 'index') {
        routers['get'](
          `/${this.apiPath}/${path}`,
          (req: Request, res: CoreResponseType) =>
            handler.index({ request: req, response: res })
        );
      } else {
        restfulPack.forEach(restful => {
          if (restful.method === 'post') {
            routers[restful.method](
              `/${this.apiPath}/${path}`,
              (req: Request, res: CoreResponseType) =>
                handler[restful.fn]({ request: req, response: res })
            );
          } else {
            routers[restful.method](
              `/${this.apiPath}/${path}/:id`,
              (req: Request, res: CoreResponseType) =>
                handler[restful.fn]({ request: req, response: res })
            );
          }
        });
      }
    }
    this.instance.use(routers);
  }

  public listen(options: CoreListenOptions): Server {
    return this.instance.listen(
      options.port,
      options.success({ port: options.port })
    );
  }
}
