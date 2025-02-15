import { MongoClient } from 'mongodb';

declare global {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
  
  export {};
  