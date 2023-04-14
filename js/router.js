const mysql = require("mysql");
const db = mysql.createConnection({
   host: "127.0.0.1",
   user: "root",
   password: '123456',
   database: "users",
})
const https = require('https');
const fs = require('fs');
function GetTime () {
   var date = new Date();
   let year = date.getFullYear()
   let month = date.getMonth() + 1
   let hours = date.getHours()
   let minute = date.getMinutes()
   let second = date.getSeconds()
   return `${year}:${month}:${hours}:${minute}:${second}`
}
// 下面的是获取QQ验证码
const nodemailer = require("nodemailer");
const express = require("express");
const { error } = require('console');
const router = express.Router()
// 访问根目录的时候就是这个主页面
router.get('/', (req, res) => {
   res.redirect('/index.html')

})
//点击注册的页面
router.get('/jump', (req, res) => {
   res.redirect('/regist.html')
})
// 点击登录后的页面
router.get('/login/jump', (req, res) => {
   res.redirect('/201410051726/index.html')
})

router.get('/getqq',function(){
   
})
//点击登录 
router.get('/login', function (require, response) {
   let email = require.query.e
   let psd = require.query.p
   console.log(email);
   // 先判断数据库这个账号密码是否正确
   let MysqlStr = `select * from users.new_email where email= '${email}'  and password='${psd}'`
   db.query(MysqlStr, function (err, results) {
      //如果查询成功
      if (results.length > 0) {
         console.log(`${GetTime()}查询成功${email}-${psd}`);
         //查询成功后
         //获取用户头像
         // 截取前面的QQ号
         let q = email.slice(0, 10) // QQ号码
         console.log(q);
         const avatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${q}&s=640`; // QQ头像URL
         https.get(avatarUrl, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
               chunks.push(chunk);
            });

            res.on('end', () => {
               const data = Buffer.concat(chunks);
               //把用户头像保存在文件夹中
               fs.writeFile(`../login/user.jpg`, data, (err) => {
                  if (err) {
                     console.error(err);

                  } else {
                     response.send({
                        message: '成功',
                        statusbar: 200,
                     })
                     console.log(`${GetTime()}头像保存成功`);
                  }
               });
            });

         }).on('error', (err) => {
            console.error(err);
         });

      } else {
         console.log(`${GetTime()}查询失败`);
         response.send({
            message: '失败',
            statusbar: 400
         })
      }
   })


})

//点击注册
router.post('/regist', function (req, res) {
   //获取前面传来的email和password
   let email = req.body.e
   let psd = req.body.p
   console.log(email);
   let MySelectSqlstr = 'select * from users.new_email where email=?'
   // 先判断数据库里面有没有这个用户
   db.query(MySelectSqlstr, [email], function (err, results) {
      if (results.length > 0) {
         //用户存在
         console.log(`${GetTime()}你添加的${email}已经注册过了`);
         res.send({
            message: "失败",
            statusbar: 400
         })
      } else {
         // 用户不存在 用户不存在就添加这个用户
         let MyInsertSqlstr = 'insert into new_email(email,password) value(?,?)'
         db.query(MyInsertSqlstr, [email, psd], function (err, results) {
            console.log(`${GetTime()}用户数据添加完成 email是${email}密码是${psd}`);
            res.send({
               message: '成功',
               statusbar: 200
            })

         })
      }
      // 在这里调用 res.redirect() 函数，确保在执行其他代码之后才发送响应
   })
})
// 验证码
router.post('/veri', function (req, res) {

   // req.query GET中获取用户想要的
   // req.body POST中获取用户传来的数据
   let email = req.body.e
   // 创建邮件传输器
   const transporter = nodemailer.createTransport({
      service: "qq",
      auth: {
         user: "2954074685@qq.com",
         pass: "ityiqrgczpcudeia",
      },
   });

   // 生成随机验证码
   let code = ''
   // 长度为5
   veri(5)

   function veri (length) {
      let chars = "ABCDEFGHIJKLMNOPQRSTuvwxyzabcdefghigklmnopqrstuvwxyz0123456789"
      for (let i = 0; i < length; i++) {
         // chaAt是获取字符串
         code += chars.charAt(Math.floor(Math.random() * chars.length))
      }

   }

   // 邮件选项
   let myEmail = "2954074685@qq.com"
   const mailOptions = {
      from: myEmail,
      to: email,
      subject: "Verification Code",
      text: `您的验证码是: ${code}哦~~~~`,
   };
   // 发送邮件
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.error(`${GetTime()}:发送失败${error}`);
      } else {
         console.log(`${GetTime()}:发送成功${info.response}`);
         console.log(`${GetTime()}:验证码是:${code}`);
         res.send({
            statusbar: 200,
            message: '成功',
            data: code
         })
      }
   });

})
// 修改密码




module.exports = router
