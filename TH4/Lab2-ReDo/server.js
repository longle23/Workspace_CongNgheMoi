// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const express = require('express')
const app = express()
const port = 3000

const data = require('./store')
const multer = require('multer')
const upload = multer()

app.use(express.static('./templates'))
app.set('view engine', 'ejs')
app.set('views', './templates')

app.get('/', (req, res) => {
    // res.send('Hello World!')

    // data = [{ ma_sp: 'abc', ten_sp: 'abc'}, { ma_sp: 'abc', ten_sp: 'abc'} ...]
    return res.render('index', { data: data })
})

app.post('/', upload.fields([]), (req, res) => {
    // console.log('req.body = ' + req.body)
    data.push(req.body)
    return res.redirect('/')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})