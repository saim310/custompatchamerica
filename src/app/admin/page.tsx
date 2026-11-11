import type { Metadata } from "next";
import { authConfigured, isAdmin } from "@/lib/admin-auth";
import { listPosts } from "@/lib/blog-store";
import BlogAdmin from "./BlogAdmin";
import "./admin.css";
export const metadata: Metadata = { title: "Blog Admin | Custom Patch America", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const authenticated = await isAdmin();
  return <BlogAdmin key={String(authenticated)} authenticated={authenticated} configured={authConfigured()} initialPosts={authenticated ? await listPosts(true) : []} />;
}
