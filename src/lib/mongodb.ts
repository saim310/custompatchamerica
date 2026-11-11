import { MongoClient, type Db } from "mongodb";

const globalMongo = globalThis as typeof globalThis & {
  blogMongo?: { uri: string; promise: Promise<MongoClient>; databases?: Map<string, Db> };
};
export function mongoConfigured() { return !!process.env.MONGODB_URI?.trim(); }
export function mongoUri() {
  let uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("Set MONGODB_URI in your server environment.");
  for (const [placeholder, value] of [
    ["<db_username>", process.env.MONGODB_USERNAME], ["<username>", process.env.MONGODB_USERNAME],
    ["<db_password>", process.env.MONGODB_PASSWORD], ["<password>", process.env.MONGODB_PASSWORD],
  ]) {
    if (value) uri = uri.replaceAll(placeholder!, encodeURIComponent(value));
  }
  if (/<[^>]+>/.test(uri)) throw new Error("Replace the placeholders in MONGODB_URI or configure MONGODB_USERNAME and MONGODB_PASSWORD.");
  return uri;
}
export async function blogDatabase() {
  const uri = mongoUri();
  if (!globalMongo.blogMongo || globalMongo.blogMongo.uri !== uri) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 20000 });
    const entry = { uri, promise: client.connect(), databases: new Map<string, Db>() };
    globalMongo.blogMongo = entry;
    entry.promise.catch(() => {
      if (globalMongo.blogMongo === entry) globalMongo.blogMongo = undefined;
      void client.close().catch(() => {});
    });
  }
  // Hot reload can retain a connection created by an earlier version of this module.
  // Capture the entry before awaiting so concurrent configuration changes cannot
  // pair one client's connection with another client's database cache.
  const entry = globalMongo.blogMongo;
  const client = await entry.promise;
  // Respect a database named in the URI; otherwise use the application database.
  const uriDatabase = new URL(uri).pathname.slice(1).split("?")[0];
  const name = process.env.MONGODB_DB?.trim() || (uriDatabase ? decodeURIComponent(uriDatabase) : "custompatchamerica");
  const cached = entry.databases ??= new Map<string, Db>();
  if (!cached.has(name)) cached.set(name, client.db(name));
  return cached.get(name)!;
}
