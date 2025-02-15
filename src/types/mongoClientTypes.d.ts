import { MongoClient } from "mongodb";

declare global {
  interface GlobalWithMongoDB {
    _mongoClientPromise?: Promise<MongoClient>;
  }

  // Extend the global interface without using var/const
  interface Global extends GlobalWithMongoDB {}
}

// Ensure this file is treated as a module
export {};