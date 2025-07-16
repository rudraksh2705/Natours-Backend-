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