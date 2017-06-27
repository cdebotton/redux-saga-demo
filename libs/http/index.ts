import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import renderMiddleware from './middleware/render';

const { PORT } = process.env;

if (!PORT) {
  throw new ReferenceError('process.env.PORT is undefined.');
}

const app = new Koa();
app.use(compress());
app.use(bodyParser());
app.use(renderMiddleware());

app.listen(PORT, () => {
  process.stdout.write(`✅ Listening on port ${PORT}.`);
});
