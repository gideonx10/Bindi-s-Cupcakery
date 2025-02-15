import { MongoClient, MongoClientOptions } from "mongodb";

interface GlobalWithMongoDB {
  _mongoClientPromise?: Promise<MongoClient>;
}

// Ensure globalThis has the correct type
const globalScope = globalThis as GlobalWithMongoDB;

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your .env.local file"
  );
}

const uri: string = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

const client: MongoClient = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalScope._mongoClientPromise) {
    globalScope._mongoClientPromise = client.connect();
  }
  clientPromise = globalScope._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
