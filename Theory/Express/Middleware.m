Har wo function jo route se jud kar request-response cycle mein participate karta hai, wo middleware hi hota hai

middleware in Express.js that tells  server to automatically parse incoming JSON data from the request body.->

app.use(express.json());

func that can modify incoming req data
stands between req and res
middleware in Express.js that tells  server to automatically parse incoming JSON data from the request body.->

Middleware in Express is a function that has access to the request (req), response (res), and the next middleware in the cycle (next). It is used to modify req or res, handle errors, or run code before sending a response.
Everything is Middlware
Order is defined by the order they are defined in stack
Req and resp obj goes through each middleware
Next func is called to execute next middleware
Like a pipeline
 

app.get('/api/v1/tours' , getAllTours);

we can add ? to make a param optional
app.get('/api/v1/tours/:id' , getTour);

app.post('/api/v1/tours' , createTour);

app.patch('/api/v1/tours/:id' , updateTour);

204 means no content to show
app.delete('/api/v1/tours/:id' , deleteTour); 
