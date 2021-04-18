
'use strict'

const email = require('emailjs')

/**
 * 发送邮件
 * @param {String} message
 * @param {String} to 
 */
async function sendEmail (message, toSomeBody) {
  let server = email.server.connect({
    user: "interviewSystem@blued.com",
    password: "Danlan4001",
    host: "smtp.exmail.qq.com",
    port: 465,
    ssl: true
  })

  server.send({
    text: message,
    from: "interviewSystem@blued.com",
    to: toSomeBody,
    subject: "面试信息"
  }, (err, message) => {
    if (err) {
      console.log('发送失败', err)      
    }
  })
}

module.exports = {
  sendEmail
}


