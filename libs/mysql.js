/**
 * mysql connector
 */
'use strict'

const mysql = require('mysql')

let config = require('../configs/default').mysql

const islcoal = process.env.NODE_ENV === 'local'
if(islcoal) {
    config = require('../configs/local').mysql
}

const pool = mysql.createPool(config)

let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool
      .getConnection(function (err, connection) {
        if (err) {
          reject(err)
        } else {
          connection.query(sql, values, (err, rows) => {

            if (err) {
              reject(err)
            } else {
              resolve(rows)
            }
            connection.release()
          })
        }
      })
  })
}

module.exports = {
  query
}
