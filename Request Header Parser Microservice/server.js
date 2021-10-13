'use strict'
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


app.get('/api/whoami',(req,res)=>{

res.json({
ipaddress:req.ip,

language:req.headers["accept-language"],

software: req.headers["user-agent"]

});

});



app.listen(port,()=>{
console.log("hello");
});
