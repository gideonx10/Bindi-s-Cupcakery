import { MongoClient } from "mongodb";

declare global {
  interface GlobalWithMongoDB {
    _mongoClientPromise?: Promise<MongoClient>;
  }

  var globalThis: GlobalWithMongoDB; // Explicitly extend the global scope
}

// Ensure this file is treated as a module
export {};
