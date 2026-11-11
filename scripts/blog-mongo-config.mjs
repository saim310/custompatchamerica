import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
export function connectionUri() {
  let uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error('Set MONGODB_URI in .env.local first.');
  for (const [placeholder, value] of [
    ['<db_username>', process.env.MONGODB_USERNAME], ['<username>', process.env.MONGODB_USERNAME],
    ['<db_password>', process.env.MONGODB_PASSWORD], ['<password>', process.env.MONGODB_PASSWORD],
  ]) if (value) uri = uri.replaceAll(placeholder, encodeURIComponent(value));
  if (/<[^>]+>/.test(uri)) throw new Error('Replace MongoDB URI placeholders or set MONGODB_USERNAME and MONGODB_PASSWORD.');
  return uri;
}
export function databaseName(uri) {
  const name = new URL(uri).pathname.slice(1);
  return process.env.MONGODB_DB?.trim() || (name ? decodeURIComponent(name) : 'custompatchamerica');
}
