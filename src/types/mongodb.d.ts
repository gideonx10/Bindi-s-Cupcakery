import { ConnectOptions } from 'mongoose';

export interface MongoDBConnectionOptions extends ConnectOptions {
  serverSelectionTimeoutMS: number;
  connectTimeoutMS: number;
  socketTimeoutMS: number;
  maxPoolSize: number;
  retryWrites: boolean;
  family: number;
  maxIdleTimeMS: number;
  heartbeatFrequencyMS: number;
}

export interface ExtendedError extends Error {
  cause?: {
    message: string;
  };
}
