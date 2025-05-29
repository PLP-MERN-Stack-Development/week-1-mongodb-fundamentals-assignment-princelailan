[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19668700&assignment_repo_type=AssignmentRepo)

# MongoDB Fundamentals Assignment

This assignment focuses on learning MongoDB fundamentals including setup, CRUD operations, advanced queries, aggregation pipelines, operator demonstrations, indexing, and explain plans.

## Assignment Overview

You will:

1. Set up a MongoDB database
2. Perform basic CRUD operations
3. Write advanced queries with filtering, projection, and sorting
4. Create aggregation pipelines for data analysis
5. Implement indexing for performance optimization
6. Demonstrate index usage via explain plans
7. Use operators: `$in`, `$ne`, `$exists`, `$regex`

## Getting Started

1. Accept the GitHub Classroom assignment invitation.
2. Clone your personal repository created by GitHub Classroom.
3. Install MongoDB locally or set up a MongoDB Atlas account.
4. Run the provided `insert_books.js` (or use `mongoimport`) to populate your database with sample data.
5. Complete all queries in `queries.js`.

## Files Included

* `Week1-Assignment.md`: Detailed assignment instructions
* `insert_books.js`: Script to populate your MongoDB database with sample book data
* `queries.js`: Your main script containing all assignment queries
* `README.md`: This file

## Requirements

* Node.js (v18 or higher)
* MongoDB (local installation or Atlas account)
* MongoDB Shell (`mongosh`) or MongoDB Compass

## Technologies Used

* MongoDB (NoSQL Database)
* Node.js
* MongoDB Node.js Driver

## Project Structure

```
/ week-1-mongodb-fundamentals-assignment
│
├── insert_books.js       # Data import script
├── queries.js            # Main script with all assignment queries
├── data/                 # (Optional) JSON sample data files
└── README.md             # This file
```

## Queries Script Breakdown

All queries in `queries.js` are numbered to match the assignment spec, plus extra operator demos:

1. **Find all books in Fiction**
2. **Find books published after 1950**
3. **Find books by George Orwell**
4. **Update the price of "1984" to 13.99**
5. **Delete "Moby Dick"**

### Advanced Queries

6. **Find books in stock and published after 2010**
7. **Projection:** Return only `title`, `author`, and `price` fields for Fiction
8. **Sort by price (ascending)**
9. **Sort by price (descending)**
10. **Pagination:** Page 1 (5 books)
11. **Pagination:** Page 2 (next 5 books)

### Aggregation Pipelines

12. **Average price of books by genre**
13. **Author with the most books**
14. **Group books by publication decade**

### Indexing & Explain Plans

15. **Create index on `title`**
16. **Create compound index on `author` and `published_year`**
17. **Explain plan for query on `title`**

### Operator Demonstrations

* **A. `$in`:** Find books whose genre is either `Fiction` or `Fantasy`
* **B. `$ne`:** Exclude books by a specific author
* **C. `$exists`:** Identify documents missing the `price` field
* **D. `$regex`:** Match titles starting with "The"

## How to Run

1. Clone this repository.
2. Ensure MongoDB is running locally at `mongodb://localhost:27017` or configure your Atlas URI in `queries.js`.
3. Navigate to the project folder.
4. Install dependencies:

   ```bash
   npm install mongodb
   ```
5. Import sample data (if using `mongoimport`):

   ```bash
   mongoimport --db plp_bookstore --collection books --file data/books.json --jsonArray
   ```
6. Run the queries script:

   ```bash
   node queries.js
   ```
7. Verify each numbered output in your terminal.

## Sample Output

Each console log is labeled with its query number for easy verification. For example:

```
1: [ { _id: ObjectId("..."), title: "Example", genre: "Fiction", ... } ]
...
17 explain: { queryPlanner: { winningPlan: { ... } }, executionStats: { ... } }
```

## Submission

Push all changes (including `queries.js` and this updated `README.md`) back to your GitHub Classroom repo. Ensure:

* All 17 numbered queries and 4 operator demos are implemented in `queries.js`.
* You’ve run the script and confirmed correct output.

## Resources

* [MongoDB Official Documentation](https://docs.mongodb.com/)
* [MongoDB Aggregation Pipeline](https://docs.mongodb.com/manual/aggregation/)
* [MongoDB Indexing](https://docs.mongodb.com/manual/indexes/)
* [Node.js Driver for MongoDB](https://mongodb.github.io/node-mongodb-native/)

## Future Enhancements

* Integrate with a Node.js/Express backend API.
* Add authentication and role-based access.
* Expand dataset and query complexity.
* Connect to a React frontend to complete the MERN stack flow.
