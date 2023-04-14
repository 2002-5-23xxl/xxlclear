const express = require("express");
const app = express()
app.use(express.urlencoded({ extended: true }))
// 解决跨域
const cors = require("cors")
const router = require("./router");
app.use(cors())
app.use('/', router)
// 需要先告诉他文件夹
app.use(express.static('../login'))
app.listen(1010, () => {
   console.log("run at http://localhost:1010");
})


