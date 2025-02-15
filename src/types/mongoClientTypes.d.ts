// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { MongoClient } from "mongodb";

export interface GlobalWithMongoDB extends NodeJS.Global {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare global {
  namespace NodeJS {
    interface Global extends GlobalWithMongoDB {}
  }
}

export {};
