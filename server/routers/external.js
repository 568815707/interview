// first router

const router = require('koa-router')({prefix: '/view'})
const { query } = require('../../libs/mysql.js')

router.get('/external', async(ctx, next) => {
  const arr = await query(`
    SELECT * 
    FROM external_questions
  `)

  ctx.body = {
    result: arr
  }
  await next()
})

module.exports = router
