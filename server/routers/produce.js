const router = require('koa-router')({prefix: '/view'})
const {query} = require('../../libs/mysql.js')
const TABLE_NAME = 'internal_questions'

router.get('/get_preview_data', async ctx => {
    let {tech, level} = ctx.request.query
    let data = {}
    try{
        let teches = tech.split(',')
        for(let i=0; i<teches.length ; i++ ){
            let res = await get_data(teches[i], level)
            data[teches[i]] = res
        }

        ctx.body = {
            code: 200,
            data
        }
    }catch(err){
        throw(err)
    }
})

async function get_data(tech, level) {
    try {
        let sql = `SELECT COUNT(*) as count
            FROM ${TABLE_NAME} 
            WHERE level = ${Number(level)} AND type = '${tech}' AND audit=1 `

        let total = await query(sql)
        let start = Math.max(Math.floor(Math.random() * total[0].count)-5,0)
        sql = sql + ` LIMIT ${start},5`
        sql = sql.replace('COUNT(*) as count', '*')
        return await query(sql)
    }catch(err){
        console.log(err)
    }
}

module.exports=router