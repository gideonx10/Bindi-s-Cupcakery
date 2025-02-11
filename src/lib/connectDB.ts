import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(retries = 3) {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      connectTimeoutMS: 30000,         // Increased to 30 seconds
      socketTimeoutMS: 45000,          // Increased to 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
      // Add these network configurations
      family: 4,                       // Force IPv4
      maxIdleTimeMS: 10000,           // Reduce idle time
      heartbeatFrequencyMS: 5000,     // More frequent heartbeats
      // keepAlive: true,                // Enable keep-alive
      // keepAliveInitialDelay: 300000,  // 5 minutes
    };

    // Clear any existing failed connection attempt
    if (cached.promise && !cached.conn) {
      cached.promise = null;
    }

    // If there's no existing connection attempt
    if (!cached.promise) {
      // Log the connection attempt
      console.log('Attempting to connect to MongoDB...');
      
      cached.promise = mongoose.connect(MONGODB_URI as string, opts);
    }

    try {
      cached.conn = await cached.promise;
      console.log('Successfully connected to MongoDB');
      return cached.conn;
    } catch (error) {
      cached.promise = null;

      if (retries > 0) {
        console.log(`Connection attempt failed. Retrying... (${retries} attempts left)`);
        // Exponential backoff: wait longer between each retry
        const backoffTime = Math.min(1000 * (4 - retries), 5000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return connectDB(retries - 1);
      }

      if (error instanceof Error) {
        console.error('MongoDB Connection Error Details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          cause: (error as any).cause ? (error as any).cause.message : undefined
        });
      }

      throw new Error(
        `Failed to connect to MongoDB after ${3 - retries} attempts. ` +
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
  cached.conn = null;  // Reset the connection cache on disconnect
});

process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

export default connectDB;