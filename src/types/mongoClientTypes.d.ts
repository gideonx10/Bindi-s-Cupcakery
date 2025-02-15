export interface GlobalWithMongoDB {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare global {
  let _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
