require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express')
const multer = require("multer")
const AWS = require('aws-sdk');

// const ejs = require('ejs')
// const data = require("./store")
const app = express();
const upload = multer();

app.use(express.static('./templates'))
app.set('view engine', 'ejs');
app.set('views', './templates');

//config aws dynamodb
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECREST_ACCESS_KEY,
    region: process.env.REGION,

});

const tableName = 'SanPham';
const docClient = new AWS.DynamoDB.DocumentClient();

app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send('Internal Server Error');
        } else {
            // console.log('data =', JSON.stringify(data));
            return res.render('index', { data: data.Items });
        }
    });
    // data =[{ ma_sp: '6', ten_sp: '0' },{ ma_sp: '6', ten_sp: '0' },...]

});

app.post('/', upload.fields([]), (req, res) => {
    const { ma_sp, ten_sp, so_luong } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            return res.send('Internal Server Error');
        } else {
            console.log('data =', JSON.stringify(data));
            return res.redirect('/');
        }
    })
});
app.post('/delete', upload.fields([]), (req, res) => {
    const { ma_sp } = req.body;
    const params = {
        TableName: tableName,
        Key: {
            ma_sp
        }
    };
    docClient.delete(params, (err, data) => {
        if (err) {
            return res.send('NO');
        } else {
            return res.redirect('/');
        }
    });
});
app.listen(4000, () => {
    console.log(`Example app listening on port 4000`);
});
