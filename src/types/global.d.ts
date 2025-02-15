import { Connection } from 'mongoose';
import { MongoClient } from 'mongodb';

declare global {
  // This is how you properly extend globalThis
  interface Window {
    _mongooseConnection: MongooseCache | null;
    _mongoClientPromise: Promise<MongoClient> | null;
  }
}

export interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}