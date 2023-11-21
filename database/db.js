const { MongoClient } = require('mongodb');

// Replace the connection string with your MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017';

let db;

async function connectToDatabase(databaseName) {
    if (db) return db;

    try {
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(databaseName);
        console.log(`Connected to MongoDB database: ${databaseName}`);
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connectToDatabase };
