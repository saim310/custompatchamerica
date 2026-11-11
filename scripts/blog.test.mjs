import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { connectionUri } from './blog-mongo-config.mjs';
const mongoMode = process.env.BLOG_TEST_MONGODB === 'true';
const testDatabase = 'cpa_blog_test_' + randomBytes(12).toString('hex');
const uri = mongoMode ? connectionUri() : '';
const mongo = mongoMode ? new MongoClient(uri, { serverSelectionTimeoutMS: 10000 }) : null;

const base = 'http://localhost:3137';
const prefix = path.join(tmpdir(), 'cpa-blog-test-');
const directory = await mkdtemp(prefix);
const password = randomBytes(24).toString('hex');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3137'], {
  env: { ...process.env, NODE_ENV: 'production', MONGODB_URI: uri, MONGODB_DB: testDatabase, ADMIN_PASSWORD: password, ADMIN_SESSION_SECRET: randomBytes(32).toString('hex'), ADMIN_SITE_ORIGIN: base, BLOG_STORAGE_DIR: directory },
  stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
});
let output = '';
server.stdout.on('data', data => { output = (output + data).slice(-10000); });
server.stderr.on('data', data => { output = (output + data).slice(-10000); });
let cookie = '';
async function call(url, body, { auth = true, origin = base, method = 'POST' } = {}) {
  return fetch(base + url, { method, headers: { Origin: origin, ...(auth && cookie ? { Cookie: cookie } : {}), ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }) }, body: method === 'DELETE' ? undefined : body instanceof FormData ? body : JSON.stringify(body) });
}
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try { if ((await fetch(base + '/admin')).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, output);
  assert.equal((await call('/api/admin/posts', {})).status, 401);
  assert.equal((await call('/api/admin/session', { password }, { origin: 'https://other.example' })).status, 403);
  assert.equal((await call('/api/admin/session', { password: 'wrong' })).status, 401);
  const login = await call('/api/admin/session', { password });
  assert.equal(login.status, 200);
  assert.match(login.headers.get('set-cookie'), /HttpOnly/i);
  cookie = login.headers.get('set-cookie').split(';')[0];
  assert.ok((await (await fetch(base + '/admin', { headers: { Cookie: cookie } })).text()).includes('Good stories start here'));
  const form = new FormData();
  form.set('image', new Blob(['fake image'], { type: 'image/png' }), 'bad.png');
  assert.equal((await call('/api/admin/uploads', form)).status, 400);
  const valid = new FormData();
  valid.set('image', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6jXQAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'cover.png');
  const uploaded = await call('/api/admin/uploads', valid);
  assert.equal(uploaded.status, 200);
  const { url } = await uploaded.json();
  const image = await fetch(base + url);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/png');
  let post = { slug: 'integration-test-story', title: 'Integration Test Story', category: 'Testing', excerpt: 'A draft visibility test.', service: '/contact-us', image: url, sections: [{ heading: 'A heading', text: '<script>alert(1)</script>\nSecond paragraph.' }], status: 'draft', revision: '' };
  let result = await call('/api/admin/posts', post);
  assert.equal(result.status, 200, await result.clone().text());
  post = (await result.json()).post;
  assert.equal((await fetch(base + '/blog/' + post.slug)).status, 404);
  assert.ok(!(await (await fetch(base + '/blog')).text()).includes(post.title));
  result = await call('/api/admin/posts', { ...post, status: 'published' });
  assert.equal(result.status, 200);
  const stale = post;
  post = (await result.json()).post;
  const article = await fetch(base + '/blog/' + post.slug);
  assert.equal(article.status, 200);
  const html = await article.text();
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok((await (await fetch(base + '/blog')).text()).includes(post.title));
  assert.equal((await call('/api/admin/posts', stale)).status, 400);
  assert.equal((await call('/api/admin/posts', { ...post, revision: '' })).status, 400);
  assert.equal((await call('/api/admin/posts', { ...post, slug: '../escape' })).status, 400);
  assert.equal((await call('/api/admin/posts', { ...post, status: 'draft' })).status, 200);
  assert.equal((await fetch(base + '/blog/' + post.slug)).status, 404);
  assert.equal((await call('/api/admin/session', null, { method: 'DELETE' })).status, 200);
  if (mongo) {
    const db = mongo.db(testDatabase);
    const stored = await db.collection('blog_posts').findOne({ _id: post.slug });
    assert.equal(stored.status, 'draft');
    assert.equal(await db.collection('blog_posts').countDocuments(), 4);
    const cover = await db.collection('blog_images').findOne({ _id: url.split('/').pop() });
    assert.equal(cover.contentType, 'image/png');
    assert.ok(cover.data.length() > 0);
    console.log('PASS: posts, seed guides, and binary image data persisted in isolated MongoDB database.');
  }
  console.log('PASS: login, origin checks, protected writes, upload validation and serving, drafts, publication, escaped content, revision conflicts, unpublishing, logout.');
} catch (error) {
  console.error(output);
  throw error;
} finally {
  server.kill();
  await new Promise(resolve => { if (server.exitCode !== null) resolve(); else { server.once('exit', resolve); setTimeout(resolve, 5000); } });
  const resolved = path.resolve(directory);
  if (!resolved.startsWith(path.resolve(prefix)) || path.dirname(resolved) !== path.resolve(tmpdir())) throw new Error('Unsafe cleanup target');
  await rm(resolved, { recursive: true, force: true });
  if (mongo) {
    try {
      if (!/^cpa_blog_test_[a-f0-9]{24}$/.test(testDatabase)) throw new Error('Unsafe database cleanup target');
      await mongo.db(testDatabase).dropDatabase();
    } finally { await mongo.close(); }
  }
}
