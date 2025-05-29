const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const coll = 'books';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const books = db.collection(coll);

  console.log('1:', await books.find({ genre: 'Fiction' }).toArray());
  console.log('2:', await books.find({ published_year: { $gt: 1950 } }).toArray());
  console.log('3:', await books.find({ author: 'George Orwell' }).toArray());
  console.log('4:', await books.updateOne({ title: '1984' }, { $set: { price: 13.99 } }));
  console.log('5:', await books.deleteOne({ title: 'Moby Dick' }));

  console.log('6:', await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray());
  console.log('7:', await books.find({ genre: 'Fiction' }, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray());
  console.log('8:', await books.find().sort({ price: 1 }).toArray());
  console.log('9:', await books.find().sort({ price: -1 }).toArray());
  console.log('10:', await books.find().skip(0).limit(5).toArray());
  console.log('11:', await books.find().skip(5).limit(5).toArray());

  console.log('12:', await books.aggregate([
    { $group: { _id: '$genre', averagePrice: { $avg: '$price' }, count: { $sum: 1 } } },
    { $sort: { averagePrice: -1 } }
  ]).toArray());
  console.log('13:', await books.aggregate([
    { $group: { _id: '$author', bookCount: { $sum: 1 } } },
    { $sort: { bookCount: -1 } },
    { $limit: 1 }
  ]).toArray());
  console.log('14:', await books.aggregate([
    { $group: { _id: { $floor: { $divide: ['$published_year', 10] } }, count: { $sum: 1 } } },
    { $project: { _id: 0, decade: { $concat: [{ $toString: { $multiply: ['$_id', 10] } }, 's'] }, count: 1 } },
    { $sort: { decade: 1 } }
  ]).toArray());

  console.log('15 index:', await books.createIndex({ title: 1 }));
  console.log('16 index:', await books.createIndex({ author: 1, published_year: -1 }));

  const explain = await books.find({ title: '1984' }).explain('queryPlanner');
  console.log('17 explain:', JSON.stringify(explain.queryPlanner, null, 2));

  console.log('A:', await books.find({ genre: { $in: ['Fiction', 'Fantasy'] } }).toArray());
  console.log('B:', await books.find({ author: { $ne: 'Alice Walker' } }).toArray());
  console.log('C:', await books.find({ price: { $exists: false } }).toArray());
  console.log('D:', await books.find({ title: { $regex: '^The', $options: 'i' } }).toArray());

  await client.close();
}

run().catch(console.error);
