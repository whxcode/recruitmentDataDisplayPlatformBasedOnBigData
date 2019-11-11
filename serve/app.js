const Koa = require(`koa`)
const KoaStatic = require(`koa-static-server`)
const KoaRouter = require(`koa-router`)
const mysql = require(`mysql`)
const link = mysql.createConnection({
  host:`172.17.6.101`,
  port:'3306',
  user:'root',
  password:'123456',
  database:'job',
})
const app = new Koa()
const {promisify} = require(`util`)

const {map} = require(`./router/index.js`)
app.on('error',err => {
  console.log(err)
})
app.use(async (ctx,next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin); // 很奇怪的是，使用 * 会出现一些其他问题
  ctx.set('Access-Control-Allow-Headers', 'content-type');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH')
  await next()
})
app.use(KoaStatic({
  rootDir:`${__dirname}/static/`,
  rootPath:`/public`
}))
app.use(map.routes())
try {
  let address = getIPAdress()
  console.log(address)
  app.listen({
    host:address,
    port:5000
  })
}catch (e) {

}
function getIPAdress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

