import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getPriceCollection() {
  const connectedClient = await clientPromise;
  const db = connectedClient.db('rjs_multicuisine');
  return db.collection('price_overrides');
}

export async function getSettingsCollection() {
  const connectedClient = await clientPromise;
  const db = connectedClient.db('rjs_multicuisine');
  return db.collection('restaurant_settings');
}

export async function getMenuCollection() {
  const connectedClient = await clientPromise;
  const db = connectedClient.db('rjs_multicuisine');
  return db.collection('menu_items');
}

export default clientPromise;
