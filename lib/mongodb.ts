import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eduguide";

let clientPromise: Promise<MongoClient | null>;

declare global {
  var _mongoClientPromise: Promise<MongoClient | null> | undefined;
}

async function connectToMongo(): Promise<MongoClient | null> {
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    return await client.connect();
  } catch (e) {
    console.warn("[MongoDB] Database connection skipped/unavailable. Falling back to local offline storage.");
    return null;
  }
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectToMongo();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connectToMongo();
}

export default clientPromise;

