/**
 * 面试邀约记录
 * @author： osenki
 */

const router = require('koa-router')({ prefix: '/view'})
const { query } = require('../../libs/mysql.js')
const { get_data } = require('../../libs/common')
const { sendEmail } = require('../../libs/sendEmail')
const moment = require('moment')
const TABLE_NAME = 'visit_record'
const { teachs, k2n } = require('../../libs/tech.json')

// 获取面试记录
router.get('/get_visit', async ctx => {
  try {
    const { page = 1 } = ctx.query
    const data = await get_data(TABLE_NAME, page, 'time', 'DESC')
    
    const total = await query(`
      SELECT COUNT(*) AS count
      FROM ${TABLE_NAME}
    `).then(res => res[0]['count'])

    ctx.body = {
      code: 200,
      data,
      total
    }
  } catch (e) {
    throw  e   
  }
})

// 添加面试记录
router.post('/add_visit', async ctx => {
  try {
    const { name = '', jobs = '', level = '', time = '', home = '' } = ctx.request.body

    // 将信息存入到表中
    await query(`
      INSERT INTO ${TABLE_NAME}
      VALUES (id, '${name}', '${jobs}', '${level}', '${time}', '${home}', 0)
    `)

    const data = await get_data(TABLE_NAME, 1, 'time', 'DESC')
    
    const total = await query(`
      SELECT COUNT(*) AS count
      FROM ${TABLE_NAME}
    `).then(res => res[0]['count'])

    // 发送邮件告知相关负责人
    const message = 
    '亲爱的面试官：' 
    + '\n' + 
    `你好，新增一份面试哦，详情如下：`
    + '\n' + 
    `【面试岗位】: ${k2n[jobs]}` 
    + '\n' + 
    `【面试者】：${name}` 
    +'\n' + 
    `【面试题级别】：${k2n[level]}`
    +'\n' + 
    `【面试时间】: ${moment(time).format('YYYY-MM-DD HH:mm:ss')}` 
    + '\n' + 
    `【会议室】： ${k2n[home]}`
    + '\n' + 
    '还请及时安排面试官，不要忘了面试时间哦，辛苦啦！'

    // 不同技术方向的负责人
    let to = ''

    switch (jobs) {
      case 'Web':
        to = "nieweidong@blued.com;qinxikun@blued.com"
        break;
      case 'Bi':
        to = "zhangxiang@blued.com"
        break;
      case 'Android':
        to = "xiejing@blued.com"
        break;
      case 'Ios':
        to = "xiejing@blued.com"
        break;
      case 'Php':
        to = "min@blued.com"
      default:
        return null
    }

    await sendEmail(message, to)
    ctx.body = {
      code: 200,
      data,
      total
    }
  } catch (e) {
    throw e
  }
})

// 是否爽约/ 是否删除该记录
router.post('/is_miss', async ctx => {
  try {
    const { id, name = '', jobs = '', time = '', page, type } = ctx.request.body
    if (type === 'miss') {
      // 爽约操作
      await query(`
        UPDATE ${TABLE_NAME}
        SET status = 1
        WHERE id = ${id}
      `)
  
      // 发送邮件告知相关负责人
      const message = 
      '亲爱的面试官：' + '\n' + 
      `你好，面试者【${name}】爽约了，` 
      + '\n' + 
      `【面试岗位】: ${k2n[jobs]}` 
      + '\n' + 
      `【面试时间】: ${moment(time).format('YYYY-MM-DD HH:mm:ss')}` 
      + '\n' + 
      '辛苦啦。'
  
      // 不同技术方向的负责人
      let to = ''
  
      switch (jobs) {
        case 'Web':
          to = "wanghaiyang@blued.com"
          break;
        case 'Bi':
          to = "zhangxiang@blued.com"
          break;
        case 'Android':
          to = "xiejing@blued.com"
          break;
        case 'Ios':
          to = "xiejing@blued.com"
          break;
        case 'Php':
          to = "min@blued.com"
        default:
          return null
      }
  
      await sendEmail(message, to)
    } else {
      await query(`
        DELETE FROM ${TABLE_NAME}
        WHERE id = ${id}
      `)
    }

    const data = await get_data(TABLE_NAME, page, 'time', 'DESC')
    const total = await query(`
      SELECT COUNT(*) AS count
      FROM ${TABLE_NAME}
    `).then(res => res[0]['count'])

    ctx.body ={
      code: 200,
      data,
      total
    }
  } catch (e) {
    throw e
  }
})

module.exports = router