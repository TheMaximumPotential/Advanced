const http = require('http')
const fs = require('fs')
const path = require('path')
const rootDir = 'G:/Advanced/09.08/wx-miniprogram-framework'


const app = http.createServer((req, res) => {
    const filePath = path.join(rootDir + req.url)
    console.log(filePath)
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            res.write('')
            res.end()
        }
        res.write(content)
        res.end()
    })
})

app.listen(9000, () => {
    console.log('9000端口监听成功')
})
