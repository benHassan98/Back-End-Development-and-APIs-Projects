'use strict'
require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const {Schema} = mongoose;
mongoose.connect(process.env.MONGO_URL,{useUnifiedTopology: true,
useNewUrlParser: true
});
const userschema = new Schema({
   username: String
});
const excerciseschema = new Schema({
  id:String,
  description:String,
  duration:Number,
  date:Number
});

const User = mongoose.model('user',userschema);
const Excercise = mongoose.model('excercise',excerciseschema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/api/users",async (req,res)=>{
  console.log("GET USERS");
  try{
    let find = await User.find({});
    find.map( i=> {
return {
      username: i.username,
      _id: i._id

    };

    }  );

    res.send(find);
  }
  catch(err){
    res.status(500);
  }

});

app.post('/api/users',async (req,res)=>{
console.log("CREATE USERS");
try{
let findone = await User.findOne({username:req.body.username});
if(findone)
res.json({
  username:findone.username,
  _id: findone._id
  });

else{
let doc = new User ({username:req.body.username});
await doc.save();
res.json({
  username:doc.username,
  _id:doc._id
  });


}

}
catch(err){
  res.status(500);
}

});

app.post('/api/users/:_id/exercises',async (req,res)=>{
console.log("CREATE EXCERCISES");
try{
let findOne = await User.findById({
  _id: req.params._id
});
if(findOne){
let doc = new Excercise({
  id:req.params._id,
  description:req.body.description,
  duration:req.body.duration,
  date:new Date(req.body.date).getTime()  || new Date().getTime()
});
await doc.save();
res.json({
  username:findOne.username,
  description:doc.description,
  duration:doc.duration,
  date: new Date(doc.date).toDateString(),
  _id:doc.id
});

}
else{
res.status(404).send("User not found");
}

}
catch(err){
  res.status(500);
}

});


app.get("/api/users/:_id/logs",async (req,res)=>{
console.log("GET LOGS");
try{
  let findOne = await User.findById({_id:req.params._id});
  let docs;
  let from = req.query.from, to = req.query.to, limit = req.query.limit;

  if(from && to){

  from = new Date(req.query.from).getTime();
  to = new Date(req.query.to).getTime();

    docs = await Excercise.find({
    id:req.params._id,
    date:{$gte:from , $lte:to}

  });

  }
 else
  docs = await Excercise.find({id:req.params._id});

if(limit)docs = docs.slice(0,limit);



res.json({
username:findOne.username,
count: docs.length,
_id:findOne._id,
log:docs.map( i=> new Object({
description:i.description,
duration:i.duration,
date:new Date(i.date).toDateString()
})  )

});



}
catch(err){
  res.status(500);
}

});

app.listen(PORT,()=>console.log("hello"));
