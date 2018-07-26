import { Response } from 'express';
import { CoreSuccessHandler, CoreErrorHandler } from 'coreStatusHandler';

export class ResponseStatusHandler
  implements CoreSuccessHandler, CoreErrorHandler {
  res: Response;
  constructor(res: Response) {
    this.res = res;
  }
  OK(data: any): void {
    this.res.status(200).send(data);
  }
  Created(data: any): void {
    this.res.status(201).send(data);
  }
  BadRequest(): void {
    this.res.sendStatus(400);
  }
  Unauthorized(): void {
    this.res.sendStatus(401);
  }
  PaymentRequired(): void {
    this.res.sendStatus(402);
  }
  Forbidden(): void {
    this.res.sendStatus(403);
  }
  NotFound(): void {
    this.res.sendStatus(404);
  }
  MethodNotAllowed(): void {
    this.res.sendStatus(405);
  }
  InternalServerError(): void {
    this.res.sendStatus(500);
  }
  BadGateway(): void {
    this.res.sendStatus(502);
  }
}
