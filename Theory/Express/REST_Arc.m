Rest Architecture->

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

Content type is automatically set in express-js

only sent when a get method is sent to server


app.get('/' , (req , res)=>{
    res.status(200)
    .send({message : 'Hello from server' , app : 'Natours'});
});