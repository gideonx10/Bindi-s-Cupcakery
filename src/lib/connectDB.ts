import mongoose, { Connection } from 'mongoose';
import type { MongoDBConnectionOptions, ExtendedError } from '../types/mongodb';
import type { MongooseCache } from '../types/global';

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Ensure MONGODB_URI is string
const MONGODB_URI: string = process.env.MONGODB_URI;

// Initialize the cached connection with type safety
interface GlobalWithMongooseCache extends globalThis.Global {
  _mongooseConnection?: MongooseCache;
}

const globalWithMongooseCache: GlobalWithMongooseCache = globalThis as unknown as GlobalWithMongooseCache;

const cached: MongooseCache = globalWithMongooseCache._mongooseConnection || { 
  conn: null, 
  promise: null 
};

// Set the global cache
if (!((globalThis as unknown) as GlobalWithMongooseCache)._mongooseConnection) {
  (globalThis as unknown as GlobalWithMongooseCache)._mongooseConnection = cached;
}

async function connectDB(retries = 3): Promise<Connection> {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    const opts: MongoDBConnectionOptions = {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      family: 4,
      maxIdleTimeMS: 10000,
      heartbeatFrequencyMS: 5000,
    };

    // Clear any existing failed connection attempt
    if (cached.promise && !cached.conn) {
      cached.promise = null;
    }

    // If there's no existing connection attempt
    if (!cached.promise) {
      console.log('Attempting to connect to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
    }

    try {
      cached.conn = await cached.promise;
      console.log('Successfully connected to MongoDB');
      return cached.conn;
    } catch (error) {
      cached.promise = null;

      if (retries > 0) {
        console.log(`Connection attempt failed. Retrying... (${retries} attempts left)`);
        const backoffTime = Math.min(1000 * (4 - retries), 5000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return connectDB(retries - 1);
      }

      if (error instanceof Error) {
        const extendedError = error as ExtendedError;
        console.error('MongoDB Connection Error Details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          cause: extendedError.cause?.message
        });
      }

      throw new Error(
        `Failed to connect to MongoDB after ${3 - retries} attempts. \n` +
        'Please check:\n' +
        '1. Your connection string is correct\n' +
        '2. Your IP address is whitelisted in MongoDB Atlas\n' +
        '3. Your network/firewall allows outbound connections to port 27017\n' +
        '4. No VPN/proxy is interfering with the connection'
      );
    }
  } catch (error) {
    console.error('Fatal MongoDB connection error:', error);
    throw error;
  }
}

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
  cached.conn = null;
});

process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

export default connectDB;