/**
 * 注册
 * @author: osenki
 */

const router = require('koa-router')({prefix: '/view'})
const { query } = require('../../libs/mysql.js')

const USER_TABLE_NAME = 'users'

router.post('/register', async (ctx, next) => {
  try {
    const { user, pwd, name } = ctx.request.body
    
    // 将注册信息写入到表中
    await query(`
      INSERT INTO ${USER_TABLE_NAME}
      VALUES (id ,'${user}', '${pwd}', '${name}', 0)
    `)

    ctx.body = {
      code: 200
    }
    
  } catch (error) {
    throw error
  }
})

module.exports = router
