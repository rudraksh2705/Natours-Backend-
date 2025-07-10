MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need
stores data in documents
no-sql database
built in scalability
flexibility->diff num and type of fields
Perfomant dbms
Free and open Source database
used to build modern and scalable applications
uses BSON for data storage(typed , all have data types)
have fields and data stored in key value pairs
1 document size = 16mb
each document contains a unique id

// ✅ 1. Switch to or create database
use Natours

// ✅ 2. Show all databases
show dbs

// ✅ 3. Drop database if needed (optional reset)
db.dropDatabase()

// ✅ 4. Insert one document
db.tours.insertOne({
  name: "Everest Expedition",
  price: 999,
  rating: 4.9
})

// ✅ 5. Insert many documents
db.tours.insertMany([
  { name: "Desert Safari", price: 300, rating: 4.7 },
  { name: "Jungle Trek", price: 450, rating: 4.8 },
  { name: "City Tour", price: 150, rating: 4.3 },
  { name: "Beach Paradise", price: 600, rating: 5.0 }
])

// ✅ 6. Show collections in current DB
show collections

// ✅ 7. Find all documents
db.tours.find().pretty()

// ✅ 8. Count documents
db.tours.countDocuments()

// ✅ 9. Find with $or
db.tours.find({
  $or: [{ price: { $lt: 400 } }, { rating: { $gt: 4.8 } }]
})

// ✅ 10. Find with $and
db.tours.find({
  $and: [{ price: { $gt: 400 } }, { rating: { $gte: 4.8 } }]
})

// ✅ 11. Update one document
db.tours.updateOne(
  { name: "Desert Safari" },
  { $set: { featured: true } }
)

// ✅ 12. Update many documents
db.tours.updateMany(
  { price: { $gt: 500 }, rating: { $gte: 4.8 } },
  { $set: { premium: true } }
)

// ✅ 13. Create an index (on price)
db.tours.createIndex({ price: 1 })

// ✅ 14. Aggregation example: average price
db.tours.aggregate([
  { $group: { _id: null, avgPrice: { $avg: "$price" } } }
])

// ✅ 15. Delete with condition
db.tours.deleteMany({ rating: { $lt: 4.8 } })

// ✅ 16. Drop the collection
db.tours.drop()

// ✅ 17. Final check — list collections
show collections

