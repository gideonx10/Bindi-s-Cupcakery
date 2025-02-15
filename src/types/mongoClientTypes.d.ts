// types/mongodb.d.ts
import { MongoClient } from "mongodb";

export interface GlobalWithMongoDB {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare global {
  namespace NodeJS {
    interface Global extends GlobalWithMongoDB {}
  }
}