const path = require('path');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');

const Koa = require('koa');
const app = new Koa();

app.use(koaStatic(path.join(__dirname, 'public')));
app.use(koaBodyParser());

const Router = require('koa-router');
const router = new Router();

const clients = new Set();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    clients.add(resolve);

    ctx.req.on('aborted', () => {
      clients.delete(resolve);
      resolve();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400, 'Empty message');
  }

  clients.forEach((resolve) => {
    resolve(message);
  });

  clients.clear();

  ctx.body = '200 Ok';
});

app.use(router.routes());

module.exports = app;
