'use strict'
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors);

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/index.html');
  });


app.post('/api',upload.single('upfile')  ,(req,res)=>{
res.status(200).json({
 name: req.file.originalname ,
 type: req.file.mimetype,
 size: req.file.size
});

}  );



app.listen(5000,()=>console.log("Hello"));
