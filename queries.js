// queries.js - MongoDB queries for Week 1 assignment (revised)

const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const coll = 'books';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const books = db.collection(coll);
  console.log('🚀 Connected');

  // 1. Find all books in Fiction
  console.log('\n1:', await books.find({ genre: 'Fiction' }).toArray());

  // 2. Find books published after 1950
  console.log('\n2:', await books.find({ published_year: { $gt: 1950 } }).toArray());

  // 3. Find books by George Orwell
  console.log('\n3:', await books.find({ author: 'George Orwell' }).toArray());

  // 4. Update price of "1984" to 13.99
  console.log('\n4:', await books.updateOne(
    { title: '1984' },
    { $set: { price: 13.99 } }
  ));

  // 5. Delete "Moby Dick"
  console.log('\n5:', await books.deleteOne({ title: 'Moby Dick' }));

  // --- Advanced Queries ---

  // 6. In stock AND published after 2010
  console.log('\n6:', await books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
  }).toArray());

  // 7. Projection for Fiction: only title, author, price
  console.log('\n7:', await books.find(
    { genre: 'Fiction' },
    { projection: { _id: 0, title: 1, author: 1, price: 1 } }
  ).toArray());

  // 8 / 9. Sort by price ascending & descending
  console.log('\n8:', await books.find().sort({ price: 1 }).toArray());
  console.log('\n9:', await books.find().sort({ price: -1 }).toArray());

  // 10 / 11. Pagination (5 per page)
  console.log('\n10:', await books.find().skip(0).limit(5).toArray());
  console.log('\n11:', await books.find().skip(5).limit(5).toArray());

  // 12. Average price by genre (aggregation)
  console.log('\n12:', await books.aggregate([
    { $group: { _id: '$genre', averagePrice: { $avg: '$price' }, count: { $sum: 1 } } },
    { $sort: { averagePrice: -1 } }
  ]).toArray());

  // 13. Author with most books
  console.log('\n13:', await books.aggregate([
    { $group: { _id: '$author', bookCount: { $sum: 1 } } },
    { $sort: { bookCount: -1 } },
    { $limit: 1 }
  ]).toArray());

  // 14. Books by decade
  console.log('\n14:', await books.aggregate([
    {
      $group: {
        _id: { $floor: { $divide: ['$published_year', 10] } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        decade: { $concat: [ { $toString: { $multiply: ['$_id', 10] } }, 's' ] },
        count: 1
      }
    },
    { $sort: { decade: 1 } }
  ]).toArray());

  // 15. Create index on title
  console.log('\n15 index:', await books.createIndex({ title: 1 }));

  // 16. Compound index on author & published_year
  console.log('\n16 index:', await books.createIndex({ author: 1, published_year: -1 }));

  // 17. Explain plan for title query
  const explain = await books.find({ title: '1984' }).explain('queryPlanner');
  console.log('\n17 explain:', JSON.stringify(explain.queryPlanner, null, 2));

  // === Extra operator demos ===

  // A. $in: find books whose genre is either Fiction or Fantasy
  console.log('\nA ($in):', await books.find({
    genre: { $in: ['Fiction', 'Fantasy'] }
  }).toArray());

  // B. $ne: find books not written by Alice Walker
  console.log('\nB ($ne):', await books.find({
    author: { $ne: 'Alice Walker' }
  }).toArray());

  // C. $exists: find books missing a price field
  console.log('\nC ($exists):', await books.find({
    price: { $exists: false }
  }).toArray());

  // D. $regex: find titles that start with “The”
  console.log('\nD ($regex):', await books.find({
    title: { $regex: '^The', $options: 'i' }
  }).toArray());

  await client.close();
  console.log('\n💤 Disconnected');
}

run().catch(console.error);
