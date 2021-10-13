'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL,{
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const { Schema } = mongoose;
const urlschema = new Schema ({
  original_url : String,
  short_url : Number
});
const Url = mongoose.model('url',urlschema);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/api/shorturl',async (req,res)=>{
console.log("POST");
let url = url_checker(req.body.url);
if(url === "-1")res.json({error:"invalid url"});
else{

try{
let lkup = await lookup(url);
let indx = ( await Url.find({}) ).length+1;

let doc = new Url ({original_url:req.body.url,short_url:indx});
let ret = await doc.save();
res.json({original_url:ret.original_url,short_url:ret.short_url});
}
catch(err){

res.json({error:"invalid url"});
}


}

});

app.get('/api/shorturl/:shorturl?',(req,res)=>{
console.log("GET");
Url.findOne({short_url:req.params.shorturl},(err,data)=>{
if(err)res.json({error: err});
else{

res.redirect(data.original_url);
}

});

});






app.listen(port,()=>console.log("hello"));



async function lookup(host){

return new Promise((resolve,reject)=>{
dns.lookup(host,(err,address)=>{
  if(err)reject(err);
  resolve(address);
});


});




}
function url_checker(url){
let host = "-1";
if(url.indexOf('https://')>-1)
host =  url.split("https://")[0];

else if (url.indexOf('http://')>-1)
host = url.split("http://")[0];


return host;
}
