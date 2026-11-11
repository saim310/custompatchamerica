# Custom Patch America

Minimal Next.js project using App Router, TypeScript, Tailwind CSS, and ESLint.

## Structure

- src/app/ - Root layout and future routes.
- src/components/ - Future reusable components.
- src/assets/ - Project assets.
- src/styles/ - Global Tailwind CSS stylesheet, imported by the root layout.

The @/* import alias points to src/*.
No pages or reusable components are included. The root URL returns 404 until a page is added.

## Commands

- npm run dev - Start the development server.
- npm run build - Create a production build.
- npm start - Serve the production build.
- npm run lint - Run ESLint.
- npm run typecheck - Check TypeScript types.

## Resend email for all forms

The homepage, contact form, and quote builder use /api/quotes. Resend sends
all submitted details and any uploaded artwork to your inbox. Reply-to is
the customer's address.

1. Verify your sending domain in Resend and create an API key with sending access.
2. Copy .env.example to .env.local in the project root.
3. Set RESEND_API_KEY, RESEND_FROM_EMAIL (a sender on your verified domain),
   and RESEND_TO_EMAIL (your receiving inbox, or comma-separated inboxes).
4. Restart the development server and submit each form. Check your inbox and Resend logs.
5. Add the same variables to your hosting environment and redeploy for production.

Keep the API key private; never use NEXT_PUBLIC_ for these variables.
Resend takes priority over webhook/storage. Partial configuration or a failed
send returns an error. Success means Resend accepted the email, not guaranteed
inbox delivery. Without Resend settings the existing webhook/storage is used.


## Blog admin

Open `/admin` to create and edit articles, upload PNG/JPG/WebP covers (5 MB maximum), preview posts, save drafts, and publish immediately to `/blog`. Existing guides are editable; their originals remain in source as seed data. Saving a published post as a draft removes it from the public blog. Slugs are fixed after first save. Concurrent edits are rejected; reload before retrying. Content is plain text with section headings and preserved line breaks, and is safely escaped by React. Uploaded images have public URLs, including images uploaded for drafts; do not upload confidential media.

Set `ADMIN_PASSWORD` (12+ characters) and `ADMIN_SESSION_SECRET` (32+ random characters) in `.env.local` or your hosting environment. Use a cryptographically random session secret. Restart the app after changing environment variables. There are no default credentials. Sessions expire after eight hours; changing the password or secret invalidates existing sessions. Production requires HTTPS for the secure session cookie.

Set `ADMIN_SITE_ORIGIN` to your public origin when using a reverse proxy. Login and write APIs verify the origin; each write also verifies the signed, HTTP-only session. Login allows ten attempts per fifteen-minute window per server process; add hosting-level rate limiting when scaling beyond one instance.

**MongoDB storage:** Set `MONGODB_URI` in `.env.local` and in your hosting environment. Optionally set `MONGODB_DB`; otherwise the database in the URI is used, falling back to `custompatchamerica`. Atlas URI placeholders `<db_username>` / `<db_password>` can be filled by `MONGODB_USERNAME` / `MONGODB_PASSWORD`; literal credentials in a URI must be URL encoded. Keep all these variables server-only. Your database user needs read/write access, and Atlas Network Access must allow the application host. Restart the app after changing configuration.

With `MONGODB_URI` present, all blog posts, draft status, revisions, and uploaded covers are stored in MongoDB (`blog_posts` and `blog_images`). Existing source guides are inserted only when absent, so application restarts never overwrite edited guides or drafts. Images retain their existing URLs and are stored as binary documents under the 5 MB upload limit. Connections are reused per server process. Post slugs use MongoDB's unique document IDs; revision-conditional writes reject concurrent edits atomically across application instances. Configured database failures are surfaced rather than silently switching post writes to local disk. Admin login credentials remain in the server environment.

To import previously saved local posts and images, run `npm run migrate:blog` with MongoDB configured. The command reads `BLOG_STORAGE_DIR` or `.data/blog`, preserves image filenames, leaves local files intact, and skips posts already edited in MongoDB. Run this before removing local storage. No persistent application disk is needed after migration. Back up your MongoDB database.

Without `MONGODB_URI`, legacy file storage remains available: development uses `.data/blog`; production requires an absolute private persistent `BLOG_STORAGE_DIR`, a single application instance, and backups of that directory. Ephemeral hosts should use MongoDB.

Validation: `npm run lint`, `npm run typecheck`, `npm run build`, then `npm run test:blog`. Blog integration tests require a completed production build and use port 3137 with temporary isolated storage and credentials.

Run `npm run test:blog:mongo` after building to test against your configured MongoDB in a temporary `cpa_blog_test_*` database. The test deletes only its own temporary database and never uses your application database. Your test user must have permission to create and drop that temporary database.

Deployment refresh again
