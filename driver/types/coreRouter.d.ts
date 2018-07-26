import { Request, Response } from 'express';
import { ResponseStatusHandler } from 'coreStatusHandler';

interface CoreResponseType extends Response {
  responseStatusHandler: ResponseStatusHandler;
}

export type HandlerType = {
  request?: Request;
  response?: CoreResponseType;
};

export interface RouterRule {
  readonly path: string;
  index({ request, response }: HandlerType): void;
  create({ request, response }: HandlerType): void;
  read({ request, response }: HandlerType): void;
  update({ request, response }: HandlerType): void;
  delete({ request, response }: HandlerType): void;
}

export class CoreRouter implements RouterRule {
  path: string;
  constructor(path: string);
  public index({ request, response }: HandlerType): void;
  public create({ request, response }: HandlerType): void;
  public read({ request, response }: HandlerType): void;
  public update({ request, response }: HandlerType): void;
  public delete({ request, response }: HandlerType): void;
}
