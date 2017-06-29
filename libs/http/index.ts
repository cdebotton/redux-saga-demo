import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as Router from 'koa-router';
import * as statics from 'koa-static';
import * as path from 'path';
import docsMiddleware from './middleware/docs';
import renderMiddleware from './middleware/render';

const { PORT } = process.env;

if (!PORT) {
  throw new ReferenceError('process.env.PORT is undefined.');
}

const app = new Koa();
const router = new Router();

router.get('/docs', docsMiddleware());

app.use(compress());
app.use(bodyParser());
app.use(statics(path.join(__dirname, '../../dist')));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(renderMiddleware());

app.listen(PORT, () => {
  process.stdout.write(`✅ Listening on port ${PORT}.`);
});
