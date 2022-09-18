const express = require('express')
const app = express()
const port = 3000

const data = require('./store');

app.use(express.static('./templates')); 
app.set('view engine', 'ejs');
app.set('views', './templates');

app.get('/', (req, res) => {
    // res.send('Hello World!')
    return res.render('index');
})

app.post('/', (req, res) => {
    console.log('req.body = ', req.body);
});
/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})