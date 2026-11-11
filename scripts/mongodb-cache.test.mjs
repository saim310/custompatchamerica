import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/mongodb.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const uri = 'mongodb://localhost/cache_test';
const database = { name: 'cache_test' };
let calls = 0;
const client = { db: () => { calls++; return database; } };
const globals = { blogMongo: { uri, promise: Promise.resolve(client) } };
const module = { exports: {} };
new Function('require', 'module', 'exports', 'globalThis', 'process', compiled)(
  () => ({ MongoClient: class { constructor() { throw new Error('Unexpected connection'); } } }),
  module, module.exports, globals, { env: { MONGODB_URI: uri } },
);
assert.equal(await module.exports.blogDatabase(), database);
assert.equal(await module.exports.blogDatabase(), database);
assert.equal(calls, 1, 'Reuse the database after upgrading a legacy hot-reload cache');
let resolve;
const original = { uri, promise: new Promise(done => { resolve = done; }) };
globals.blogMongo = original;
const pending = module.exports.blogDatabase();
const replacement = { uri, promise: Promise.resolve(client), databases: new Map() };
globals.blogMongo = replacement;
resolve(client);
assert.equal(await pending, database);
assert.equal(original.databases.get('cache_test'), database);
assert.equal(replacement.databases.size, 0, 'Never use the cache of a replacement connection');
console.log('PASS: legacy hot-reload cache recovery, database reuse, and concurrent cache replacement.');
