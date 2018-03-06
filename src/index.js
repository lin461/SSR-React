import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';
import Routes from './client/Routes';
import renderer from './helper/renderer';
import createStore from './helper/createStore';

const app = express();

app.use(
  '/api',
  proxy('http://react-ssr-api.herokuapp.com', { // this second argument is due to the API that is used, just to make live easier. specifically for Google OAuth process to avoid security errors.
    proxyReqOptDecorator(opts) {
      opts.headers['x-forwarded-host'] = 'localhost:3000'; // Purpose of headers: redirect user back to localhost:3000, after OAuth process
      return opts;
    }
  })
);
app.use(express.static('public'));
app.get('*', (req, res) => {
  const store = createStore(req);
  // some logic to initialize and load data into the store
  const promises = matchRoutes(Routes, req.path)
  .map(({ route }) => {
    return route.loadData? route.loadData(store) : null;
  })
  .map(promise => {
    if(promise) {
      return new Promise((resolve, reject) => {
        promise.then(resolve).catch(resolve);
      });
    }
  });
  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req, store, context);
    if(context.url) {
      return res.redirect(301, context.url);
    }
    if(context.notFound) {
      res.status(404);
    }
    res.send(content);
  });
});

app.listen(3000, () => {
  console.log('Hi there.3000');
});
