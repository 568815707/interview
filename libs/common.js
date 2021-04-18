const { query } = require('../libs/mysql')

/**
 * 
 * @param {String} table_name 
 * @param {Number || String} page 
 */
async function get_data (table_name, page, param, sorts) {
  try {
    const pageStart = (Number(page) - 1 ) * 10
    const pageStep = 10

    let ORDER_SORT = param && sorts ? `ORDER BY ${param} ${sorts}` : ''
    
    return await query(`
      SELECT * 
      FROM ${table_name}
      ${ORDER_SORT}
      LIMIT ${pageStart}, ${pageStep}
    `)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  get_data
}