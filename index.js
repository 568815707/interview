'use strict'

const Koa = require('koa')
const path = require('path')
const cors = require('koa2-cors')
const jwt = require('koa-jwt')
const bodyParser = require('koa-bodyparser')
const secret = 'interview'
const app = new Koa()

// 路由文件
const login = require('./server/routers/login')
const external = require('./server/routers/external')
const register = require('./server/routers/register')
const typein = require('./server/routers/typein')
const typeto = require('./server/routers/typeto')
const audit = require('./server/routers/audit')
const record = require('./server/routers/record')
const produce = require('./server/routers/produce')
const visit =require('./server/routers/visit')
const manage =require('./server/routers/manage')

const dev = process.env.NODE_ENV === 'development'

if(dev) {
    app.use(
      cors({
        credentials: true,
        origin: 'http://localhost:3333'
      })
    )
}else {
    app.use(require('koa-static')(__dirname + '/app/dist'))
    app.use(require('koa-views')(path.resolve(__dirname + '/app/dist'), {
        extension: 'html'
    }))

    app.use((ctx,next) => {
        if(!ctx.path.startsWith('/view')) {
            return ctx.render('./index.html')
        }
        return next()
    })
}



// koa2 中没有对 POST 的解析，所以需要引用 koa-bodyparser 进行解析 POST 请求
app.use(bodyParser())

// jwt 鉴权
app.use(jwt({
  secret,
}).unless({
  path: [/\/register/, /\/login/, /\/logout/],
}))

// 路由抛出
app.use(login.routes()).use(login.allowedMethods())
app.use(external.routes()).use(external.allowedMethods())
app.use(register.routes()).use(register.allowedMethods())
app.use(typein.routes()).use(typein.allowedMethods())
app.use(typeto.routes()).use(typeto.allowedMethods())
app.use(audit.routes()).use(audit.allowedMethods())
app.use(record.routes()).use(record.allowedMethods())
app.use(produce.routes()).use(produce.allowedMethods())
app.use(visit.routes()).use(visit.allowedMethods())
app.use(manage.routes()).use(manage.allowedMethods())

app.listen(9000, function () {
  console.log('listen on 9000')
})

process.on('uncaughtException', function (err) {
  console.log(err)
  console.log(err.message)
  console.log(err.stack)
  process.exit()
})
