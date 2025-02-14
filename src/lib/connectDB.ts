import mongoose, { Connection, ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface CachedConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}


// Declare global type
declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(retries = 3): Promise<Connection> {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    const opts: ConnectOptions = {
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
      cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => mongoose.connection);
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
        interface ExtendedError extends Error {
          cause?: {
            message: string;
          };
        }

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