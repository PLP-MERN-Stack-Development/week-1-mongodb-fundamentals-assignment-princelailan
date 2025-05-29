// queries.js - MongoDB queries for Week 1 assignment

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('Connected to MongoDB');

    // 1. Find all books in a specific genre (e.g., Fiction)
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log('\nBooks in Fiction genre:', fictionBooks);

    // 2. Find books published after a certain year (e.g., after 1950)
    const booksAfter1950 = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log('\nBooks published after 1950:', booksAfter1950);

    // 3. Find books by a specific author (e.g., George Orwell)
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log('\nBooks by George Orwell:', orwellBooks);

    // 4. Update the price of a specific book (e.g., "1984" to 13.99)
    const updateResult = await collection.updateOne(
      { title: '1984' },
      { $set: { price: 13.99 } }
    );
    console.log(`\nUpdated price of "1984": matched ${updateResult.matchedCount}, modified ${updateResult.modifiedCount}`);

    // 5. Delete a book by its title (e.g., "Moby Dick")
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(`\nDeleted "Moby Dick": deleted count ${deleteResult.deletedCount}`);

    // --- Advanced Queries ---

    // 6. Find books that are both in stock and published after 2010
    const inStockRecentBooks = await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log('\nBooks in stock and published after 2010:', inStockRecentBooks);

    // 7. Projection: Return only title, author, and price fields for books in Fiction genre
    const projectedFictionBooks = await collection.find(
      { genre: 'Fiction' },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log('\nFiction books with projection:', projectedFictionBooks);

    // 8. Sorting by price ascending
    const sortedByPriceAsc = await collection.find().sort({ price: 1 }).toArray();
    console.log('\nBooks sorted by price (ascending):', sortedByPriceAsc);

    // 9. Sorting by price descending
    const sortedByPriceDesc = await collection.find().sort({ price: -1 }).toArray();
    console.log('\nBooks sorted by price (descending):', sortedByPriceDesc);

    // 10. Pagination: Get 5 books per page, page 1 (skip 0)
    const page1Books = await collection.find().skip(0).limit(5).toArray();
    console.log('\nPage 1 books (5 per page):', page1Books);

    // 11. Pagination: Page 2 (skip 5)
    const page2Books = await collection.find().skip(5).limit(5).toArray();
    console.log('\nPage 2 books (5 per page):', page2Books);

    // --- Aggregation Pipelines ---

    // 12. Average price of books by genre
    const avgPriceByGenre = await collection.aggregate([
      { $group: { _id: '$genre', averagePrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { averagePrice: -1 } }
    ]).toArray();
    console.log('\nAverage price by genre:', avgPriceByGenre);

    // 13. Author with most books
    const topAuthor = await collection.aggregate([
      { $group: { _id: '$author', bookCount: { $sum: 1 } } },
      { $sort: { bookCount: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log('\nAuthor with the most books:', topAuthor);

    // 14. Group books by publication decade and count
    const booksByDecade = await collection.aggregate([
      {
        $group: {
          _id: { $subtract: [ { $floor: { $divide: ['$published_year', 10] } }, 0 ] },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          decade: { $concat: [ { $toString: { $multiply: ['$_id', 10] } }, 's' ] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { decade: 1 } }
    ]).toArray();
    console.log('\nBooks grouped by publication decade:', booksByDecade);

    // --- Indexing ---

    // 15. Create index on 'title' field
    const titleIndex = await collection.createIndex({ title: 1 });
    console.log(`\nCreated index on title: ${titleIndex}`);

    // 16. Create compound index on 'author' and 'published_year'
    const compoundIndex = await collection.createIndex({ author: 1, published_year: -1 });
    console.log(`Created compound index on author and published_year: ${compoundIndex}`);

    // 17. Use explain() to demonstrate index usage on a query
    const explainResult = await collection.find({ title: '1984' }).explain('executionStats');
    console.log('\nExplain plan for query on title "1984":');
    console.log(JSON.stringify(explainResult.executionStats, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

runQueries();
