const router = require('koa-router')({prefix: '/view'})
const {query} = require('../../libs/mysql.js')
const TABLE_NAME = 'internal_questions'
const pageStep = 10

/**
 * Get Author records
 *
 * @param author
 * @param page
 */
router.get('/get_record_data', async(ctx, next) => {
    let {author, page, audit} = ctx.request.query
    try {
        page = page ? page : 1
        
        const total = await get_count(author, audit)
        const data = await get_data(author, page, audit)

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

async function get_count(author, audit){
    try{
        audit = audit ? `AND audit IN (${audit})` : ''
        let total = await query(`
            SELECT COUNT(*) AS count FROM ${TABLE_NAME} WHERE author='${author}' ${audit}
        `)
        return total[0].count
    }catch(err){
        console.log(err)
    }
}


async function get_data(author, page, audit){
    try{
        const pageStart = (page - 1) * pageStep
        audit = audit ? `AND audit IN (${audit})` : ''
        const data = await query(`
            SELECT * FROM ${TABLE_NAME} WHERE author='${author}' ${audit} ORDER BY create_time DESC LIMIT ${pageStart},${pageStep} 
        `)
        return data
    }catch(err){
        console.log(err)
    }
}

/**
 * Del Author records
 *
 * @param author
 * @param page
 */
router.post('/del_record', async (ctx, next) => {
    let {id, page, author, audit} = ctx.request.body
    try {
        const flag = await del_record(id)
        if(flag) {
            let data = await get_data(author, page, audit)
            if(!data.length){
                page = page - 1 > 0 ? page -1 : 1
                data = await get_data(author, page, audit)
            }
            let total = await get_count(author, audit)

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
        throw err
    }
})

async function del_record(id){
    try{
        let result = await query(`
            DELETE FROM ${TABLE_NAME} WHERE id=${id}
        `)
        return  result.affectedRows > 0
    }catch(err){
        console.log(err)
    }
}


router.post('/edit_record',async ctx =>{
    const {id ,answer} = ctx.request.body
    try{
        let flag = await update_record(id, answer)
        if(flag) {
            ctx.body = {
                code: 200
            }
        }else {
            ctx.body = {
                code: 400003,
                msg: '修改失败'
            }
        }
    }catch(err){
        throw(err)
    }
})

async function update_record(id, answer) {
    try {
        const result = await query(`
            UPDATE ${TABLE_NAME} SET answer='${answer}',audit=3 WHERE id=${id}
        `)
        return result.affectedRows > 0
    }catch(err){
        console.log(err)
    }
}
module.exports = router