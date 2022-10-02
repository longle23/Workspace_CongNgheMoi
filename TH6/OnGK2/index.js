const express = require('express');
const app = express();

const PORT = 4000;
const multer = require('multer');

const upload = multer();

app.use(express.json({ extend: false }));
app.use(express.static('./views '));
app.set('view engine', 'ejs');
app.set('views', './views');

const AWS = require('aws-sdk');
const e = require('express');
const config = new AWS.Config({
    accessKeyId: 'AKIARU43LEWSMCGVZ7FD',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'BaiBao';

app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    }

    docClient.scan(params, (err, data) => {
        if (err) {
            res.send('Internal Server Error');
            console.log(err);
        } else {
            console.log('data: ', data.Items);
            return res.render('index', { baiBaos: data.Items });
        }
    });
})

///
app.get('/views/save.ejs', (req, res) => {
    return res.render('save.ejs');
})

///
app.post('/save', upload.fields([]), (req, res) => {
    const { STT, ChiSoISBN, NamXuatBan, SoTrang, TenBaiBao, TenNhomTacGia } = req.body
    const params = {
        TableName: tableName,
        Item: {
            STT,
            ChiSoISBN,
            NamXuatBan,
            SoTrang,
            TenBaiBao,
            TenNhomTacGia
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.log('Error in Insert: ', err);
            res.send('Internal Server Error' + err.message);
        } else {
            console.log("Data Insert: ", data);
            return res.redirect('/');
        }
    });
})

app.post('/delete', upload.fields([]), (req, res) => {
    const { STT } = req.body
    const params = {
        TableName: tableName,
        Key: {
            STT,
        }
    }

    docClient.delete(params, (err, data) => {
        if (err) {
            console.log('Error in Insert: ', err);
            res.send('Internal Server Error');
        } else {
            return res.redirect('/');
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})