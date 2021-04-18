/**
 * 数据录入
 * @author： osenki
 */

const router = require('koa-router')({ prefix: '/view'})
const { query } = require('../../libs/mysql.js')
const { get_data } = require('../../libs/common')
const moment = require('moment')

const TABLE_NAME = 'external_questions'
const INTERNAL_TABLE_NAME = 'internal_questions'

// 获取外部题库试题
router.get('/get_internal', async ctx => {
  const { page } = ctx.query
  
  try {
    let data = await get_data(TABLE_NAME, page)
    let count = await query(`
      SELECT COUNT(*) AS count 
      FROM ${TABLE_NAME}
    `).then((value) => value[0]['count'])
      
    ctx.body = {
      code: 200,
      data,
      count
    }
    
  } catch (error) {
    throw error
  }
})

// 删除题目
router.post('/del', async ctx => {
  const { id, page } = ctx.request.body

  await query(`
    DELETE FROM ${TABLE_NAME}
    WHERE id = ${id}
  `)
  let data = await get_data(TABLE_NAME, page)

  ctx.body = {
    code: 200,
    data
  }
})

// 加入公司内部题库
router.post('/add_internal', async ctx => {
  // 获取操作人名字
  const { cookie } = ctx.request.header
  const name = decodeURIComponent(cookie.split(';')[1].split('=')[1])
  const { id, page, level, answer } = ctx.request.body

  // 查询该题目
  const [value] = await query(`
    SELECT * 
    FROM ${TABLE_NAME}
    WHERE id = ${id}
  `)

  //加入到内部表中
  await query(`
    INSERT INTO ${INTERNAL_TABLE_NAME}
    VALUES (id, '${value['question']}', '${answer}', '${value['type']}', ${level}, '${name}', ${moment().unix()}, 0)
  `)

  // 删除外部表中该行
  await query(`
    DELETE FROM ${TABLE_NAME}
    WHERE id = ${id} 
  `)

  let data = await get_data(TABLE_NAME, page)
  let count = await query(`
      SELECT COUNT(*) AS count 
      FROM ${TABLE_NAME}
    `).then((value) => value[0]['count'])
  
  ctx.body = {
    code: 200,
    data,
    count
  }
})

// 筛选
router.post('/filter_data', async ctx => {
  try {

    const { checkValues, page } = ctx.request.body
    const pageStart = (Number(page) - 1) * 10
    const step = 10
    let result = ''
    let count = 0

    let inValues = ''
    if (!checkValues.length) {
      result = await query(`
      SELECT * 
      FROM ${TABLE_NAME}
      LIMIT ${pageStart}, ${step}
      `)
      count = await query(`
        SELECT COUNT(*) AS count
        FROM ${TABLE_NAME}
      `).then((value) => value[0]['count'])
    } else {
      checkValues.map( value => {
        inValues += `\'` + value + `\'` + ','
      })
      
      result = await query(`
        SELECT * 
        FROM ${TABLE_NAME}
        WHERE type IN (${inValues.substring(0, inValues.length - 1)})
        LIMIT ${pageStart}, ${step}
      `)
  
      count = await query(`
        SELECT COUNT(*) AS count
        FROM ${TABLE_NAME}
        WHERE type IN (${inValues.substring(0, inValues.length - 1 )})
      `).then((value) => value[0]['count'])
    }
    
    ctx.body = {
      code: 200,
      data: result,
      count
    }
      
  } catch (error) {
    console.log(error);
  }
})

module.exports = router