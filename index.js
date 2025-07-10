const express = require("express");
// const path = require('path');
const morgan = require("morgan");
const tourRouter = require("./Routes/TourRoutes");
const userRouter = require("./Routes/UserRoutes");

/*
Req

req represents the HTTP request received by the server.
It contains all information sent by the client (browser, Postman, frontend app, etc.)

Common properties:
req.body → Data sent in body (used in POST, PATCH)
req.params → Route parameters like /api/:id
req.query → Query string parameters like ?search=apple
req.method → Request type: GET, POST, etc.
req.headers → Metadata like content type, authorization, etc.
🔸 "req is used to read incoming data from the client."


Res->
res (Response Object)
res is used to send a response back to the client.
Common methods:
res.send() → Sends plain text or data
res.json() → Sends JSON data
res.status() → Sets the HTTP status code
res.redirect() → Redirects to another URL
res.end() → Ends the response without data
🔸 "res is used to send data or status back to the client."
*/
const app = express();
// app.use(morgan('dev'));

//func that can modify incoming req data
//stands between req and res
//middleware in Express.js that tells  server to automatically parse incoming JSON data from the request body.->

app.use(express.json());

app.use(express.static(`${__dirname}/public`));
/*
Middleware in Express is a function that has access to the request (req), response (res), and the next middleware in the cycle (next). It is used to modify req or res, handle errors, or run code before sending a response.
Everything is Middlware
Order is defined by the order they are defined in stack
Req and resp obj goes through each middleware
Next func is called to execute next middleware
Like a pipeline
 
*/

//Content type is automatically set in express-js

//only sent when a get method is sent to server

/*
app.get('/' , (req , res)=>{
    res.status(200)
    .send({message : 'Hello from server' , app : 'Natours'});
});
*/

// app.get('/api/v1/tours' , getAllTours);

//we can add ? to make a param optional
// app.get('/api/v1/tours/:id' , getTour);

// app.post('/api/v1/tours' , createTour);

// app.patch('/api/v1/tours/:id' , updateTour);

//204 means no content to show
// app.delete('/api/v1/tours/:id' , deleteTour);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//Rest Architecture
/*
1)Seperate API to logical resources
Obj or repre of something , which has data associated , any info can be called resource

2)should contain resource based url

3)we should use HTTP methods(CRUD Oprn)
Get-> perfom read oprn
Post-> Create new resources
Put/Patch-> Update resources 
Put->entire updated data
Patch-> expect the properties
Delete-> Delete Resource

4)send Data as JSON
lightweight data interchange format

5)Be Stateless
server should not remember prev state
*/

module.exports = app;
