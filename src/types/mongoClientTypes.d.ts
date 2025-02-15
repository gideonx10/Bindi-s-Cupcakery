// types/mongodb.d.ts
import { MongoClient } from "mongodb";

declare global {
  // Define the interface with the required property
  interface GlobalWithMongoDB {
    _mongoClientPromise?: Promise<MongoClient>;
  }

  // Extend NodeJS.Global with your interface properties directly
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

// Re-export the interface for use in other files
export interface WithMongoDB {
  _mongoClientPromise?: Promise<MongoClient>;
}

export {};