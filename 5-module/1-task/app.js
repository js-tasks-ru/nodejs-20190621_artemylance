const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    subscribers.push(resolve);

    ctx.res.on('close', () => {
      if (ctx.res.finished) return;
      subscribers.slice(subscribers.indexOf(resolve), 1);
      resolve();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) ctx.throw(400, 'bad message');

  subscribers.filter((resolve) => {
    resolve(message);
    return false;
  });

  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
