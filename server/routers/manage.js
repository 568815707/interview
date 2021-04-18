const router = require('koa-router')({prefix: '/view'})
const {query} = require('../../libs/mysql.js')
const TABLE_NAME = 'users'
const pageStep = 10

router.get('/get_user_data', async ctx => {
    let {page} = ctx.request.query
    try{
        page = page ? page : 1
        let data = await get_user_data(page)
        let total = await get_count()
        ctx.body = {
            code: 200,
            data,
            total,
            page
        }
    }catch(err){
        throw(err)
    }
})

async function get_count(){
    try{
        let total = await query(`
            SELECT COUNT(*) AS count FROM ${TABLE_NAME}
        `)
        return total[0].count
    }catch(err){
        console.log(err)
    }
}

async function get_user_data(page){
    try{
        const pageStart = (page - 1) * pageStep
        return await query(`
            SELECT * FROM ${TABLE_NAME}  LIMIT ${pageStart}, ${pageStep}
        `)
    }catch(err){
        console.log(err)
    }
} 

router.post('/del_user', async ctx => {
    let {id, page} = ctx.request.body
    try{
        let {affectedRows} = await query(`
            DELETE FROM ${TABLE_NAME} WHERE id=${id}
        `)
        if(affectedRows){
            let data = await get_user_data(page)
            if(!data.length){
                page = page - 1 > 0 ? page - 1 : 1
                data = await get_user_data(page)
            }
            let total = await get_count()

            ctx.body = {
                code: 200,
                total,
                data,
                page
            }
        }else {
            ctx.body = {
                code: 400002,
                msg: '删除失败' 
            }
        }

    }catch(err){
        throw(err)
    }
})

router.post('/edit_user', async ctx => {
    const {id, is_super} = ctx.request.body
    try{
        let {affectedRows} = await query(`
            UPDATE ${TABLE_NAME} SET is_super=${is_super} WHERE id=${id}
        `)

        if(affectedRows){
            ctx.body = {
                code: 200
            }
        }else {
            ctx.body={
                code: 40002,
                msg: '修改失败'
            }
        }
    }catch(err){
        throw(err)
    }
})

module.exports = router