import { MongoClient } from 'mongodb';

declare global {
  interface GlobalWithMongoDB {
    _mongoClientPromise: Promise<MongoClient> | undefined;
  }

  // Extend the global scope
  interface Global extends GlobalWithMongoDB {}
}

// Ensure this file is treated as a module
export {};