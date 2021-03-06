const express = require('express');
const routes = require('../routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//set up express app
const app = express();

//connect to MongoDB
mongoose.connect('mongodb://localhost/ninjago');
mongoose.Promise = global.Promise;


//1st Middleware
app.use(express.static('public'));

//2nd Middleware
app.use(bodyParser.json()); //it will reach middleware bodyParser second, then middleware routes later

//3rd Middleware
app.use('/api', routes);
//OR if we lazy to const routes = require('../routes/api'), 
//we can type this way: app.use('api', require('../routes/api'));

//4th Middleware
app.use(function(err, req, res, next){
  res.status(422).send({error: err.message});
});


app.get('/api',function(req, res){
  console.log('GET request'); //2nd: browser -> localhost:4000/api -> it will send back to terminal GET request
  //if you forget /api and only look for localhost:4000/ -> it will show on the page that "annot GET /"
  //res.end(); //if we do not have anything to send back to client, our localhost:4000/api will keep running, so we need to type res.end() to end the process
  res.send({name: 'Tien'}) //run again from begining, 1st node src/index.js; then 2nd localhost:4000/api => we will see on the page appears {name: 'Tien'} - this means we just requested API sent back that info {name: 'Tien'}
});


//listen for request
app.listen(process.env.port || 4000, function(){
  console.log('now listening for requests'); //1st: in terminal, we typed node src/index.js -> it will show "now listening for requests"
});