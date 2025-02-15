import { MongoClient, MongoClientOptions } from "mongodb";
import type { GlobalWithMongoDB } from "@/types/mongoClientTypes";

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
  // In development mode, use a global variable to preserve the value across module reloads
  const globalScope = globalThis as unknown as GlobalWithMongoDB;

  if (!globalScope._mongoClientPromise) {
    globalScope._mongoClientPromise = client.connect();
  }
  clientPromise = globalScope._mongoClientPromise || client.connect();
} else {
  // In production mode, it's best not to use a global variable
  clientPromise = client.connect();
}

export default clientPromise;
