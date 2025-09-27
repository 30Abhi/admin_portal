import { MongoClient, Db, Collection, ObjectId } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (cachedDb && cachedClient) return cachedDb;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;
  return db;
}

export async function getAdminCollection(): Promise<Collection<{ email: string; password: string }>> {
  const db = await getMongoDb();
  return db.collection<{ email: string; password: string }>("admin");
}

export type Dermatologist = {
  _id?: ObjectId;
  name: string;
  imageUrl?: string; // URL to profile image
  clinicName?: string;
  city?: string;
  state?: string;
  country?: string;
  qualifications?: string;
  experienceYears?: number;
  contactNumber?: string;
  couponCode?: string;
  // Backwards-compat legacy fields
  email?: string;
  phone?: string;
  specialization?: string;
  photoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function getDermatologistCollection(): Promise<Collection<Dermatologist>> {
  const db = await getMongoDb();
  return db.collection<Dermatologist>("dermatologist");
}

export type AdSlot = {
  _id?: ObjectId;
  adNumber: number; // 1-6 for the 6 specific ad slots
  section: "questionnaire" | "loading" | "dashboard";
  shape: "square" | "banner-wide" | "banner-medium" | "poster";
  imageUrl?: string;
  targetUrl?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function getAdSlotCollection(): Promise<Collection<AdSlot>> {
  const db = await getMongoDb();
  return db.collection<AdSlot>("ads");
}


