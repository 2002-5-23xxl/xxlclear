
const https = require('https');
const fs = require('fs');
const qq = '2954074685'; // QQ号码
const avatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=640`; // QQ头像URL

https.get(avatarUrl, (res) => {
   const chunks = [];

   res.on('data', (chunk) => {
      chunks.push(chunk);
   });

   res.on('end', () => {
      const data = Buffer.concat(chunks);

      fs.writeFile(`../login/${qq}.jpg`, data, (err) => {
         if (err) {
            console.error(err);
         } else {
            console.log('头像保存成功');
         }
      });
   });

}).on('error', (err) => {
   console.error(err);
});
