const express = require('express');
const app = express();

const PORT = 4000;
const multer = require('multer');

const upload = multer();

app.use(express.json({ extend: false }));
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

// Config aws dynamodb
const AWS = require('aws-sdk');
const e = require('express');
const config = new AWS.Config({
    accessKeyId: 'AKIARU43LEWSPXV4AXQA',
    secretAccessKey: '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',
    region: 'ap-southeast-1'
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'Bai_Bao';

app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    }
    docClient.scan(params, (err, data) => {
        if (err) {
            res.send("Internal Server Error!");
            console.log(err);
        } else {
            console.log("data: ", data.Items);
            return res.render('index', { baiBaos: data.Items });
        }
    })
})

app.post('/', upload.fields([]), (req, res) => {
    const { STT, Chi_So_ISBN, Nam_Xuat_Ban, So_Trang, Ten_Bai_Bao, Ten_Nhom_Tac_Gia } = req.body
    const params = {
        TableName: tableName,
        Item: {
            STT,
            Chi_So_ISBN,
            Nam_Xuat_Ban,
            So_Trang,
            Ten_Bai_Bao,
            Ten_Nhom_Tac_Gia
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.log("Error in Insert: ", err);
            res.send("Internal Server Error!")
        } else {
            console.log("Data Insert: ", data);
            return res.redirect("/");
        }
    })

})

app.post('/', upload.fields([]), (req, res) => {
    const { STT, Chi_So_ISBN, Nam_Xuat_Ban, So_Trang, Ten_Bai_Bao, Ten_Nhom_Tac_Gia } = req.body
    const params = {
        TableName: tableName,
        Item: {
            STT,
            Chi_So_ISBN,
            Nam_Xuat_Ban,
            So_Trang,
            Ten_Bai_Bao,
            Ten_Nhom_Tac_Gia
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.log("Error in Insert: ", err);
            res.send("Internal Server Error!")
        } else {
            console.log("Data Insert: ", data);
            return res.redirect("/");
        }
    })

})


app.post('/delete', upload.fields([]), (req, res) => {
    const { STT } = req.body;
    const params = {
        TableName: tableName,
        Key: {
            STT: Number(STT),
        }
    }

    docClient.delete(params, (err, data) => {
        if (err) {
            console.log("Error in Delete: ", err);
            res.send("Error: " + err.message);
        } else {
            return res.redirect("/");
        }
    })
    // console.log(req.body);
})

app.post('/update', upload.fields([]), (req, res) => {
    const { STT, Chi_So_ISBN, Nam_Xuat_Ban, So_Trang, Ten_Bai_Bao, Ten_Nhom_Tac_Gia } = req.body
    const params = {
        TableName: tableName,
        Key: {
            STT
        },

        UpdateExpression: "set STT = :stt, Chi_So_ISBN = :isbn, Nam_Xuat_Ban = :nxb, So_Trang = :trang, Ten_Bai_Bao = :bai, Ten_Nhom_Tac_Gia = :nhom",
        ExpressionAttributeValues: {
            ":stt": STT,
            ":isbn": Chi_So_ISBN,
            ":trang": So_Trang,
            ":bai": Ten_Bai_Bao,
            ":nhom": Ten_Nhom_Tac_Gia,
        }
    }

    docClient.update(params, function (err, data) {
        if (err) console.log(err);
        else {
            console.log(data);
            return res.redirect('/');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
})