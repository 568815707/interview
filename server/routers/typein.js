const router = require('koa-router')({prefix: '/view'})
const {query} = require('../../libs/mysql.js')

router.post('/typein', async (ctx, next) => {
    const {body} = ctx.request
    const {questions, author, create_time} = body
    try{
        await insertQuestion(questions, author, create_time)
    }catch(e){
        console.log(e)
    }
    
    ctx.body = {
        code: 200
    }
})

// question answer type author create_time audit level
// techspotid, level, question, answer
async function insertQuestion(questions, author, create_time) {

    let sql = questions.reduce(function(sql, item){
        const {question, answer, techspotid, level } = item
        sql.push(`('${question}', '${answer}', '${techspotid}', ${Number(level)},'${author}', ${create_time}, 0)`)
        return sql
    },[])

    return await query(`
        INSERT INTO internal_questions(
            question,answer,type,level, author,create_time,audit
        ) 
        VALUES ${sql.join(',')}
    `)
}

module.exports = router