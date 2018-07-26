import { RouterRule, HandlerType } from 'coreRouter';

const throwTypeError = (msg: string): void => {
  throw new Error(msg);
};
const throwError = (msg: string): void => {
  throw new Error(msg);
};

export class CoreRouter implements RouterRule {
  path: string;
  constructor(path: string) {
    if (!path)
      throwTypeError(`The "path" is typeof ${typeof path} must be string`);
    this.path = path;
    this.index = this.index;
    this.create = this.create;
    this.read = this.read;
    this.update = this.update;
    this.delete = this.delete;
  }
  public index({ request, response }: HandlerType): any {
    throwError(`Should implement the index controller`);
  }
  public create({ request, response }: HandlerType) {
    throwError(`Should implement the create controller`);
  }
  public read({ request, response }: HandlerType) {
    throwError(`Should implement the read controller`);
  }
  public update({ request, response }: HandlerType) {
    throwError(`Should implement the update controller`);
  }
  public delete({ request, response }: HandlerType) {
    throwError(`Should implement the delete controller`);
  }
}
