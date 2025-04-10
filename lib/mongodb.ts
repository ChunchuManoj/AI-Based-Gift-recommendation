import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    try {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
      console.log("MongoDB client created and connected");
    } catch (error) {
      console.error("Failed to create MongoDB client:", error);
      throw error;
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    console.log("MongoDB client created and connected");
  } catch (error) {
    console.error("Failed to create MongoDB client:", error);
    throw error;
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
