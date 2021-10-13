'use strict'
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/api/:date?',(req,res)=>{
  let date = +req.params.date?new Date(+req.params.date): new Date(   Date.parse(req.params.date)    )   ;
  if(!req.params.date)date = new Date();

  if(date.toString() === 'Invalid Date')res.send( {error:'Invalid Date' }   );

  else res.json({
  unix:date.valueOf(),
  utc: date.toGMTString()

  });

});


app.listen(port,()=>{
console.log(`time stamp app is lisitening to port${port}`);
});
