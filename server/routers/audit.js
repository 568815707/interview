const router = require('koa-router')({prefix: '/view'})
const {query} = require('../../libs/mysql.js')
const TABLE_NAME = 'internal_questions'

router.get('/get_audit_data', async (ctx, next) => {
    const {page, type} = ctx.request.query
    try{
        const {total, data} = await get_data_count(page, type)
        ctx.body = {
            code: 200,
            data,
            total,
            page
        }
    } catch(err) {
        throw(err)
    }
})

async function get_data_count(page='', type=''){
    try {
        const pageStep = 10
        const pageStart = ((page ? page : 1) - 1) * pageStep
        let where = !type ? 'WHERE audit IN (0,3)' : `WHERE audit IN (0,3)AND type IN (${type.replace(/(\w+)(,?)/g,"'$1'$2")})` 

        let total = await query(`
            SELECT COUNT(*) AS count FROM ${TABLE_NAME} ${where}
        `)

        let data = await query(`
            SELECT * FROM ${TABLE_NAME} ${where} ORDER BY 'id' LIMIT ${pageStart}, ${pageStep} 
        `)
        return {total: total[0].count, data}
    }catch (e) {
        console.log(e)
    }
}

router.post('/audit', async (ctx,next) => {
    let {id, audit, page, type}  = ctx.request.body
    // 0待审核 1通过审核 2未通过审核  3已提交 
    audit = audit ? '1' : '2'
    try {
        const flag = await editAudit(id, audit)
        if(flag){
            let {total, data} = await get_data_count(page, type)
            // 返回数据为空,则查询上一页的数据
            if(!data.length){
                page = page - 1 > 0 ? page -1 : 1
                prevData = await get_data_count(page, type)
                data = prevData.data
            }
            ctx.body = {
                code: 200,
                data,
                total,
                page
            }
        }else{
            ctx.body = {
                code: 400002,
                msg: '操作失败'
            }
        }
        
    }catch(err) {
        throw(err)
    }
})

async function editAudit(id, audit) {
    try{
        const result =  await query(`
            UPDATE ${TABLE_NAME} SET audit=${audit} WHERE id=${id}
        `)
        return result.affectedRows > 0
    }catch(e){
        console.log(e)
    }
}

module.exports = router