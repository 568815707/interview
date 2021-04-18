/**
 * 登录页面
 */

const router = require('koa-router')({ prefix: '/view'})
const jwt = require('jsonwebtoken');
const { query } = require('../../libs/mysql.js')

router.post('/login', async (ctx, next) => {
  const { body } = ctx.request
  
  const { user, pwd } = body
  const secret = 'interview'

  let data = ''
  if(!user || !pwd){
		return ctx.body = {
			code: 400002,
			msg: '参数不合法'
		}
	} else {
    data = await getName(user, pwd).then(data => data)
  }
  console.log(data)
  if(!data.length) {//没有用户
    ctx.body = {
        code: 400001 ,
        msg: '账号或密码错误'
    }
  } else {
    let {name = ''} = data[0] || []

    const token = jwt.sign({ name: encodeURIComponent(name) }, secret, { expiresIn: '1d'})

    ctx.cookies.set('user', user, {httpOnly:false, maxAge: 24 * 60 * 60 * 1000})
    ctx.cookies.set('name', encodeURIComponent(name), {httpOnly:false, maxAge: 24 * 60 * 60 * 1000})
    ctx.cookies.set('is_super', data[0]['is_super'], {httpOnly:false, maxAge: 24 * 60 * 60 * 1000})
    ctx.body = {
        code: 200,
        msg: '用户登陆成功',
        token: token
    }
  }
})


async function getName (name, password) {
  console.log(name, password)
  return await query(`
    SELECT * 
    FROM users
    WHERE user='${name}'
    AND password='${password}'
  `)
}

router.post('/logout', async (ctx) => {
    ctx.cookies.set('user', '', {httpOnly:false})
    ctx.cookies.set('name', '', {httpOnly:false})
    ctx.cookies.set('is_super', '', {httpOnly:false})

    ctx.body = {
        code: 200,
        msg: '用户退出成功'
    }
})

module.exports = router
