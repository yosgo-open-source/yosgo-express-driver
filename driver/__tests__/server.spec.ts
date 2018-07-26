import Core from '../core';
import { CoreRouter } from '../coreRouter';

import axios, { AxiosPromise, AxiosError } from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'http';
import { HandlerType } from '../types/coreRouter';

describe('Router TEST', () => {
  jest.useRealTimers();

  let listen: Server = null;

  beforeAll(done => {
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

    class Errors extends CoreRouter {
      index({ request, response }: HandlerType) {
        response.responseStatusHandler.BadRequest();
      }
      create({ request, response }: HandlerType) {
        response.responseStatusHandler.Unauthorized();
      }
      read({ request, response }: HandlerType) {
        response.responseStatusHandler.MethodNotAllowed();
      }
      update({ request, response }: HandlerType) {
        response.responseStatusHandler.Forbidden();
      }
      delete({ request, response }: HandlerType) {
        response.responseStatusHandler.NotFound();
      }
    }

    class RequestConsumer extends CoreRouter {
      create({ request, response }: HandlerType) {
        const body = request.body;
        const id = body.id;
        response.responseStatusHandler.OK({
          value: id
        });
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

    const productsHandler = new Product('products');
    const errorsHandler = new Errors('errors');
    const requestConsumer = new RequestConsumer('requestConsumer');

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

    console.log('restart the server...');
    setTimeout(done, 1000);
  });

  afterAll(() => {
    listen.close();
  });

  test('Product Router', () => {
    expect.assertions(5);
    const TEST_ROUTE = 'products';
    const methods: Array<string> = ['GET', 'POST', 'GET', 'PUT', 'DELETE'];
    const actualsResponseData: Array<string> = [
      'INDEX',
      'CREATE',
      'READ',
      'UPDATE',
      'DELETE'
    ];
    const promises: Array<AxiosPromise<any>> = methods.map(
      (method: string, index: number): AxiosPromise<any> => {
        if (index < 2) {
          return axios({
            method: method,
            url: `http://localhost:8080/api/${TEST_ROUTE}`
          });
        } else {
          return axios({
            method: method,
            url: `http://localhost:8080/api/${TEST_ROUTE}/1`
          });
        }
      }
    );

    return Promise.all(promises).then(response => {
      const actuals = response;
      actuals.forEach((actual, index: number) => {
        expect(actual.data).toEqual(actualsResponseData[index]);
      });
    });
  });

  test('Error Router', () => {
    expect.assertions(5);
    const TEST_ROUTE = 'errors';
    const methods: Array<string> = ['GET', 'POST', 'GET', 'PUT', 'DELETE'];
    const actualsResponseData: Array<string> = [
      'Bad Request',
      'Unauthorized',
      'Method Not Allowed',
      'Forbidden',
      'Not Found'
    ];
    const promises: Array<AxiosPromise<any>> = methods.map(
      (method: string, index: number): AxiosPromise<any> => {
        if (index < 2) {
          return axios({
            method: method,
            url: `http://localhost:8080/api/${TEST_ROUTE}`
          }).catch((error: AxiosError) => error.response);
        } else {
          return axios({
            method: method,
            url: `http://localhost:8080/api/${TEST_ROUTE}/1`
          }).catch((error: AxiosError) => error.response);
        }
      }
    );

    return Promise.all(promises).then(response => {
      const actuals = response;
      actuals.forEach((actual, index: number) => {
        expect(actual.data).toEqual(actualsResponseData[index]);
      });
    });
  });

  test('Request Consumer', () => {
    expect.assertions(1);

    return axios({
      method: 'POST',
      url: 'http://localhost:8080/api/requestConsumer',
      data: {
        id: 0x0000001
      }
    }).then(response => {
      const data = response.data;
      expect(data).toEqual({
        value: 0x0000001
      });
    });
  });
});

describe('Server other api path TEST', () => {
  jest.useRealTimers();

  let listen: Server = null;

  beforeAll(done => {
    class Other extends CoreRouter {
      index({ request, response }: HandlerType) {
        response.responseStatusHandler.OK('INDEX');
      }
    }

    const othersHandler = new Other('others');

    const app = new Core();
    app.init({
      apiPath: 'myApi',
      middlewares: [
        cors(),
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json()
      ]
    });
    app.routerHandler(othersHandler);
    listen = app.listen({
      port: 8080,
      success: ({ port }) => console.log(`Listen on port ${port}`)
    });

    console.log('restart the server...');
    setTimeout(done, 1000);
  });

  afterAll(() => {
    listen.close();
  });

  test('other path', () => {
    expect.assertions(1);
    return axios({
      method: 'GET',
      url: 'http://localhost:8080/myApi/others'
    }).then(response => {
      const data = response.data;
      expect(data).toEqual('INDEX');
    });
  });
});
