![screen shot 2018-08-13 at 9 45 21 am](https://user-images.githubusercontent.com/36870689/44042535-bed43378-9edd-11e8-8758-3934fc37b0c7.png)
The picture is from [REST-API-TUTORIAL of The Net Ninja](https://www.youtube.com/watch?v=fGQFeV32nwE&list=PL4cUxeGkcC9jBcybHMTIia56aV21o2cZ8&index=16) 

### Step 1: Download MongoDB
- If you use macOS, in your terminal, typed "cd/"
- It will go to "/ borlandtien$" (your home based on your personal computer's name)
- In your home base, then "mkdir data" or "sudo mkdir data" (force to make a directory - named data)
- ["mongod --dbpath data/"](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#specify-the-path-of-the-data-directory)
- When you see ["[initandlisten] waiting for connections on port 27017"](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#verify-that-mongodb-has-started-successfully) - which means MongoDB has started in your computer successfully

### Step 2: Create a package.json
- Terminal => rest-api-practice => npm init -y

### Step 3: Install express.nodejs
- Terminal => rest-api-practice => npm install express --save
- It will show in your package.json, "dependencies": {"express": "^4.16.3"}

### Step 4: Create a file "index.js"
- Since inside package.json, "main": "index.js" => which means the base will start from index.js
* Inside index.js:
```
[const express = require('express');](https://expressjs.com/en/4x/api.html#express)
const routes = require('../routes/api'); //import routes/api.js to use in index.js

//set up express app
[const app = express();](https://expressjs.com/en/4x/api.html#express)
app.use('/api', routes); //we added this line so that the index.js knows we will import everything from api.js into this for using - also in api.js, we were lazy in typing /api/ninjas, etc. so that the 'api' in front of routes will forcing every routes started with /ninjas will have /api in front.

app.get('/api',function(req, res){
  console.log('GET request');
  res.send({name: 'Tien'})
});

//listen for request
app.listen(process.env.port || 4000, function(){
  console.log('now listening for requests');
})
```
### Step 5: Create a directory - named "routes" with a file - named "api.js"
```
const express = require('express');
[const router = express.Router();](https://expressjs.com/en/4x/api.html#express.router)

//get a list of ninjas from the db
router.get('/ninjas',function(req, res){
  res.send({type: 'GET'});
});

module.exports = router; //export router to use outside api.js file
```
### Step 6: Install middleware [body-parser](https://www.npmjs.com/package/body-parser)
- npm install body-parser --save
- Then in index.js, we need to const bodyParser = require('body-parser'); also app.use(bodyParser.json())
- The purpose is to transfer from binary 00111001111 to json ('string')- which human can read.
- Later, in api.js, 
```
router.post('/ninjas',function(req, res){ //Use Postman to POST info to Body (under Raw and JSON)
    console.log(req.body);
    res.send({
        type: 'POST',
        nationality: req.body.nationality,
        relationship: req.body.relationship
    });
  }); //res.send will send the data I posted on Postman back to Client (ex: { type: 'POST', nationality: 'Vietnam', relationship: 'married' })
```

### Step 7: Install [Mongoose](http://mongoosejs.com/docs/)
- npm install mongoose --save
- Adds a layer of methods to easily save, edit, retreive, and delete data from MongoDB
- Allows us to create our Models and Schemas easily
- Created directory (named models) and a file init (named ninja.js):
```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Ninja Schema
const NinjaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    nationality: {
        type: String
    },
    relationship: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    }
});

//create Ninja model
const Ninja = mongoose.model('ninja', NinjaSchema);

module.exports = Ninja;
```
### Step 8: Connect MongoDB
- In index.js: 
```
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//connect to MongoDB
mongoose.connect('mongodb://localhost/ninjago')
```
- In api.js:
```
const Ninja = require('../models/ninja');

router.post('/ninjas',function(req, res){
    // var ninja = new Ninja(req.body);
    // ninja.save();
    Ninja.create(req.body); //Instead of making 2 lines above, we only need to use this line, they will understand both create and save into Ninja model DB.
    res.send(ninja);
  });
```
- After run in terminal, "nodemon src/index.js", and Postman (http://localhost:4000/api/ninjas), POST-body-raw-JSON with this info:
```
{
	"name": "Tien",
	"nationality": "Vietnam",
	"relationship": "married",
	"available": true
}
```
- res.send(ninja) will send back to client this info:
```
{
    "available": true,
    "_id": "5b6dd377e04ccc9f59e295e8",
    "name": "Tien",
    "nationality": "Vietnam",
    "relationship": "married",
    "__v": 0
}
```
![screen shot 2018-08-10 at 3 35 29 pm](https://user-images.githubusercontent.com/36870689/43982458-3d8b878e-9cb3-11e8-8c2b-bb9ae5f9a4e0.png)

- Install, [Robomongo](https://robomongo.org/) - cross-platform MongoDB manager
![screenshot2018-08-10at1 39 54pm](https://user-images.githubusercontent.com/36870689/43978484-9da0a1b8-9ca4-11e8-8b4b-9379ac7c9229.png)

### Step 9: Error Handling
- In api.js, add a middleware ".catch(next)"
```
router.post('/ninjas',function(req, res, next){ 
    Ninja.create(req.body).then(function(ninja){ 
        res.send(ninja);
    }).catch(next);
  });
```

### Step 10: DELETE Requests
- In api.js:
```
const Ninja = require('../models/ninja');

router.delete('/ninjas/:id', function(req, res, next){
    Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja){
      res.send(ninja);
    });
});
```
- Because every ninja has it's own id, we can see it through robomongo
![screen shot 2018-08-10 at 2 38 47 pm](https://user-images.githubusercontent.com/36870689/43980548-d45fb052-9cab-11e8-80bf-a341d49fd4f0.png)
- After copy the id of the ninja you want to delete, paste it over Postman
![screen shot 2018-08-10 at 2 46 41 pm](https://user-images.githubusercontent.com/36870689/43980661-440d9590-9cac-11e8-88bb-60efbe29271e.png)
- Then click SEND, we will see the box at the end shows the info of the ninja that we want to delete
![screen shot 2018-08-10 at 2 46 01 pm](https://user-images.githubusercontent.com/36870689/43980667-4faec1f8-9cac-11e8-8d4b-e83a767fd574.png)
- Finally, we check the Robomongo DB to see if we delete the ninja (with id above) successful or not, and yes, it works successfully
![screen shot 2018-08-10 at 2 48 45 pm](https://user-images.githubusercontent.com/36870689/43980740-87e20364-9cac-11e8-8171-c70676a3d699.png)

### Step 11: PUT Requests
- In api.js:
```
//update a ninja in the db
router.put('/ninjas/:id',function(req, res, next){
    Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Ninja.findOne({_id: req.params.id}).then(function(ninja){
            res.send(ninja);
        })
    })
  });
```
![screen shot 2018-08-10 at 3 39 33 pm](https://user-images.githubusercontent.com/36870689/43982549-9c839a24-9cb3-11e8-9fd0-7d588930f122.png)

### Step 12: [GEOJSON](http://geojson.org/) [GEOLOCATION](https://www.youtube.com/watch?v=KSf417F3ui0)
>"geometry": {
>    "type": "Point",
>    "coordinates": [125.6, 10.1]
>  },
- In ninja.js
```
//Create a geo location Schema
const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

//create Ninja Schema
const NinjaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
    },
    nationality: {
        type: String
    },
    relationship: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    },
    geometry: GeoSchema
});
```

- In api.js, (the geoNear will help us find the Ninja that is closed to us when we do GET REQUEST)
```
router.get('/ninjas',function(req, res, next){
    Ninja.geoNear(
        {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
        {maxDistance: 1000000, spherical: true}
    ).then(function(ninjas){
        res.send(ninjas);
    });
});
```

### Step 13: Create FRONT-END
- In index.js
```
app.use(express.static('public'));
```
- Create a "public" folder and 2 files - named "index.html" and "style.css"
![screen shot 2018-08-13 at 10 01 16 am](https://user-images.githubusercontent.com/36870689/44043371-f0eb0628-9edf-11e8-98a2-140d8f07b00a.png)
![screen shot 2018-08-13 at 10 02 31 am](https://user-images.githubusercontent.com/36870689/44043405-0a94f282-9ee0-11e8-871a-897680f9cb5c.png)
- In index.html
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Ninjago practice</title>
        <link href="https://http://fonts.googleapis.com/css?family=Raleway" rel="stylesheet"/>
        <link href="style.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <h1 class="title">Ninjago - a Ninja REST API</h1>
        <div id="homepage">
            <h1>Check ninja list</h1>
            <div id="ninjas"></div>
        </div>
    </body>
</html>
```

#### Middleware in this project
- In index.js file:
```
//1st Middleware
app.use(express.static('public'));

//2nd Middleware
app.use(bodyParser.json());

//3rd Middleware
app.use('/api', routes);

//4th Middleware
app.use(function(err, req, res, next){
  res.status(422).send({error: err.message}); 
});//this will response back to the client that there is/are some requirement info that the client forget to submit - according to the file ninja.js (name, nationality, relationship, available)
```

#### Install [nodemon](https://github.com/remy/nodemon) (to limit the extra steps running node src/index.js and localhost:4000/api) - if you want
- npm install --save-dev nodemon (If installing fail, try this one: [npm install -g nodemon](https://github.com/remy/nodemon))
- nodemon src/index.js


## API: Application Programming Interface
## REST: REpresentational State Transfer 
- REST: - architechtual style of the web 
- REST: - a standard/ set of guidelines by which we can structure & create API's
- REST: - REST API's have identifiable properties

## REST properties: HTTP methods: GET POST PUT DELETE (CRUD)
- GET: Used to retrieve data from the server (Reading/ retrieving a list of data)
- POST: Used to send data to the server (Create a new data and store it)
- PUT: Used to update data (Update/ edit an existing data)
- DELETE: Used to delete data (Delete a data from database)

> GET and POST will have same API Routes (localhost:4000/api/ninjas)
> PUT and DELETE will have same API Routes (localhost:4000/api/ninjas/id)

## HTTP Status Codes:
- Ex: 200 means OK; 404 means Resource Not Found; 500 means server error

## Schemas
- Define the structure of our data objects
- For example: string or number or boolean. {name: String, rank: String, availability: Boolean}

## Models
- Represent collections in MongoDB
- Ex: User Model to represent a collection of Users/ Ninja Model to represent a collection of Ninjas

* REST-API TUTORIAL from [The Net Ninja](https://www.youtube.com/watch?v=BRdcRFvuqsE&list=PL4cUxeGkcC9jBcybHMTIia56aV21o2cZ8)
