# Yosgo Express Driver

孵化一個 Yosgo Express 輪胎

```javascript
class Product extends CoreRouter {
  index({ request, response }: HandlerType) {
    response.responseStatusHandler.OK('INDEX');
  }
  create({ request, response }: HandlerType) {
    response.responseStatusHandler.OK('CREATE');
  }
  read({ request, response }: HandlerType) {
    response.responseStatusHandler.OK('READ');
  }
  update({ request, response }: HandlerType) {
    response.responseStatusHandler.OK('UPDATE');
  }
  delete({ request, response }: HandlerType) {
    response.responseStatusHandler.OK('DELETE');
  }
}

const app = new Core();
app.init({
  middlewares: [
    cors(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json()
  ]
});
app.routerHandler(productsHandler);
app.routerHandler(errorsHandler);
app.routerHandler(requestConsumer);
listen = app.listen({
  port: 8080,
  success: ({ port }) => console.log(`Listen on port ${port}`)
});
```
