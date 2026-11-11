"use client";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, FileText, ImagePlus, LogOut, Plus, Save, Search, Trash2, Eye, PenLine, CheckCircle2 } from "lucide-react";
import type { BlogPost } from "@/lib/blog-types";
const blank = (): BlogPost => ({ slug: "", title: "", category: "Patch guide", image: "/images/categories/EMBROIDERY.png", excerpt: "", service: "/contact-us", sections: [{ heading: "", text: "" }], status: "draft", updatedAt: "", revision: "" });
async function request(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok)
        throw new Error(result.error || "Something went wrong. Please try again.");
    return result;
}
export default function BlogAdmin({ authenticated, configured, initialPosts }: {
    authenticated: boolean;
    configured: boolean;
    initialPosts: BlogPost[];
}) {
    const router = useRouter();
    const [posts, setPosts] = useState(initialPosts);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [dirty, setDirty] = useState(false);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);
    const published = posts.filter(post => post.status === "published").length;
    function open(post: BlogPost | null) {
        if (dirty && !window.confirm("Discard your unsaved changes?"))
            return;
        setEditing(post ? structuredClone(post) : null);
        setDirty(false);
        setPreview(false);
        setError("");
        setMessage("");
    }
    function update(fields: Partial<BlogPost>) { setEditing(current => current ? { ...current, ...fields } : current); setDirty(true); setMessage(""); }
    async function login(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
            await request("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: new FormData(event.currentTarget).get("password") }) });
            router.refresh();
        }
        catch (error) {
            setError((error as Error).message);
        }
        finally {
            setBusy(false);
        }
    }
    async function save(status: "draft" | "published") {
        if (!editing)
            return;
        setBusy(true);
        setError("");
        setMessage("");
        try {
            const { post } = await request("/api/admin/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editing, status }) });
            setPosts(current => [post, ...current.filter(item => item.slug !== post.slug)]);
            setEditing(post);
            setDirty(false);
            setMessage(status === "published" ? "Your post is live on the blog." : "Draft saved. This post is hidden from the public blog.");
        }
        catch (error) {
            setError((error as Error).message);
        }
        finally {
            setBusy(false);
        }
    }
    async function upload(file?: File) {
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            setError("Choose an image up to 5 MB.");
            return;
        }
        setBusy(true);
        setError("");
        try {
            const form = new FormData();
            form.set("image", file);
            const result = await request("/api/admin/uploads", { method: "POST", body: form });
            update({ image: result.url });
        }
        catch (error) {
            setError((error as Error).message);
        }
        finally {
            setBusy(false);
            if (uploadRef.current)
                uploadRef.current.value = "";
        }
    }
    if (!authenticated)
        return <div className="blog-admin admin-login"><div className="login-brand"><span className="brand-symbol">C<span>PA</span></span><span>CUSTOM PATCH AMERICA</span></div><main className="login-card"><span className="admin-eyebrow">THE PATCH JOURNAL</span><h1>A space for your ideas.</h1><p>Sign in to write, edit, and publish your next story.</p>{!configured && <div className="admin-alert">Configure ADMIN_PASSWORD (12+ characters) and ADMIN_SESSION_SECRET (32+ characters) in your server environment to enable sign-in.</div>}<form onSubmit={login}><label>Admin password<input name="password" type="password" required autoComplete="current-password" maxLength={1024} autoFocus/></label>{error && <p className="admin-error" role="alert">{error}</p>}<button className="admin-primary" disabled={busy || !configured}>{busy ? "Signing in?" : "Sign in to your workspace"}<ArrowUpRight size={18}/></button></form><Link href="/">? Back to the website</Link></main><p className="login-foot">CUSTOM PATCH AMERICA ? CONTENT WORKSPACE</p></div>;
    const shown = posts.filter(post => (filter === "all" || post.status === filter) && `${post.title} ${post.category}`.toLowerCase().includes(query.toLowerCase()));
    return <div className="blog-admin admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span className="brand-symbol">C<span>PA</span></span><span>CUSTOM PATCH<br />AMERICA<small>Admin workspace</small></span></Link><p className="sidebar-label">WORKSPACE</p><button className="sidebar-active" onClick={() => open(null)}><BookOpen size={18}/>Blog posts<span>{posts.length}</span></button><div className="sidebar-bottom"><p>Your ideas. Our journal.<small>Stories that bring patches to life.</small></p><Link href="/blog" target="_blank">View website <ArrowUpRight size={16}/></Link><button disabled={busy} onClick={async () => { if (dirty && !window.confirm("Sign out and discard unsaved changes?"))
        return; setBusy(true); try {
        await request("/api/admin/session", { method: "DELETE" });
        router.refresh();
    }
    catch (error) {
        setError((error as Error).message);
    }
    finally {
        setBusy(false);
    } }}><LogOut size={16}/>Sign out</button></div></aside><div className="admin-content"><header className="admin-topbar"><span>Workspace <span>/</span> Blog {editing && <span>/ {editing.revision ? "Edit post" : "New post"}</span>}</span><span className="admin-account"><span />Administrator</span></header><main className="admin-main">{editing ? <><div className="admin-page-heading"><div><button className="admin-back" onClick={() => open(null)}>? All posts</button><h1>{editing.revision ? "Edit your story" : "Start a new story"}</h1><p>{dirty ? "You have unsaved changes." : "Give your ideas a place to grow."}</p></div><div className="admin-actions"><button disabled={busy} onClick={() => setPreview(!preview)}><Eye size={16}/>{preview ? "Edit" : "Preview"}</button><button disabled={busy} onClick={() => save("draft")}><Save size={16}/>{editing.status === "published" ? "Unpublish to draft" : "Save draft"}</button><button className="admin-primary" disabled={busy} onClick={() => save("published")}>{busy ? "Working?" : editing.status === "published" ? "Update post" : "Publish post"}<ArrowUpRight size={16}/></button></div></div>{error && <p role="alert" className="admin-error">{error}</p>}{message && <p role="status" className="admin-success"><CheckCircle2 size={17}/>{message} {editing.status === "published" && <Link href={`/blog/${editing.slug}`} target="_blank">View post ?</Link>}</p>}{preview ? <article className="admin-preview"><span className="admin-eyebrow">{editing.category} ? {editing.status}</span><h1>{editing.title || "Untitled story"}</h1><p>{editing.excerpt}</p><Image unoptimized width={600} height={400} src={editing.image} alt="Cover preview"/>{editing.sections.map((section, index) => <section key={index}><h2>{section.heading}</h2><p>{section.text}</p></section>)}</article> : <div className="editor-grid"><div className="editor-main"><section className="admin-card"><h2><PenLine size={18}/>The story</h2><label>Post title<input maxLength={180} value={editing.title} onChange={event => { const title = event.target.value; update({ title, ...(!editing.revision && (!editing.slug || editing.slug === editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) ? { slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100) } : {}) }); }} placeholder="A great story starts with a great title"/></label><label>Short introduction<textarea rows={3} maxLength={500} value={editing.excerpt} onChange={event => update({ excerpt: event.target.value })} placeholder="A short summary for your blog listing and search results?"/><small>{editing.excerpt.length}/500 characters</small></label></section><section className="admin-card"><div className="section-heading"><h2><FileText size={18}/>Post content</h2><span>{editing.sections.length} sections</span></div><p className="field-hint">Build your article with headings and paragraphs. Line breaks are preserved.</p>{editing.sections.map((section, index) => <div className="content-section" key={index}><div className="section-heading"><span>SECTION {String(index + 1).padStart(2, "0")}</span><button aria-label={`Remove section ${index + 1}`} disabled={editing.sections.length === 1 || busy} onClick={() => update({ sections: editing.sections.filter((_, i) => i !== index) })}><Trash2 size={15}/></button></div><label>Heading<input maxLength={200} value={section.heading} onChange={event => update({ sections: editing.sections.map((item, i) => i === index ? { ...item, heading: event.target.value } : item) })} placeholder="Give this section a heading"/></label><label>Body<textarea rows={7} maxLength={20000} value={section.text} onChange={event => update({ sections: editing.sections.map((item, i) => i === index ? { ...item, text: event.target.value } : item) })} placeholder="Tell your story?"/></label></div>)}<button className="add-section" disabled={editing.sections.length >= 40 || busy} onClick={() => update({ sections: [...editing.sections, { heading: "", text: "" }] })}><Plus size={16}/>Add a section</button></section></div><div className="editor-side"><section className="admin-card"><h2>Publishing details</h2><label>Category<input maxLength={80} value={editing.category} onChange={event => update({ category: event.target.value })} list="categories"/><datalist id="categories"><option>Patch guide</option><option>Design tips</option><option>Backing options</option><option>Company news</option></datalist></label><label>URL slug<input maxLength={100} value={editing.slug} disabled={!!editing.revision} onChange={event => update({ slug: event.target.value })}/><small>/blog/{editing.slug || "your-post-title"}{editing.revision && " ? URL is fixed after saving"}</small></label><label>Related page<select value={editing.service} onChange={event => update({ service: event.target.value })}>{[["/contact-us", "Contact us"], ["/embroidered-patches", "Embroidered patches"], ["/embroidered-patches#patch-options", "Patch backing options"], ["/woven-patches", "Woven patches"], ["/pvc-patches", "PVC patches"], ["/chenille-patches", "Chenille patches"], ["/leather-patches", "Leather patches"], ["/sublimated-patches", "Sublimated patches"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><span className={`status-badge ${editing.status}`}>{editing.status}</span></section><section className="admin-card"><h2>Cover image</h2><div className="cover-preview"><Image unoptimized width={600} height={400} src={editing.image} alt="Post cover"/></div><input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => upload(event.target.files?.[0])}/><button className="upload-button" disabled={busy} onClick={() => uploadRef.current?.click()}><ImagePlus size={17}/>Upload image</button><p className="field-hint">PNG, JPG or WebP. Maximum 5 MB.<br />Upload an image you have permission to use.</p></section></div></div>}</> : <><div className="admin-page-heading"><div><span className="admin-eyebrow">THE PATCH JOURNAL</span><h1>Good stories start here.</h1><p>Create, manage, and share ideas with your community.</p></div><button className="admin-primary" onClick={() => open(blank())}><Plus size={18}/>Create post</button></div>{error && <p role="alert" className="admin-error">{error}</p>}<div className="admin-stats">{[["Total posts", posts.length, BookOpen], ["Published", published, CheckCircle2], ["Drafts", posts.length - published, FileText]].map(([label, count, Icon]) => { const StatIcon = Icon as typeof BookOpen; return <div key={String(label)}><span>{String(label)}<StatIcon size={19}/></span><strong>{String(count).padStart(2, "0")}</strong><small>{label === "Published" ? "Live on your website" : label === "Drafts" ? "Ideas in the making" : "Your growing collection"}</small></div>; })}</div><section className="admin-posts"><div className="post-toolbar"><div className="post-tabs">{["all", "published", "draft"].map(value => <button className={filter === value ? "selected" : ""} key={value} onClick={() => setFilter(value)}>{value === "all" ? "All posts" : value === "draft" ? "Drafts" : "Published"}</button>)}</div><label className="admin-search"><Search size={17}/><input aria-label="Search posts" placeholder="Search your posts?" value={query} onChange={event => setQuery(event.target.value)}/></label></div><div className="post-table-heading"><span>POST</span><span>STATUS</span><span>LAST UPDATED</span><span /></div>{shown.length ? shown.map(post => <div className="post-row" key={post.slug}><div className="post-identity"><div className="post-thumbnail"><Image unoptimized width={600} height={400} src={post.image} alt=""/></div><div><span className="post-category">{post.category}</span><button onClick={() => open(post)}>{post.title}</button><small>/blog/{post.slug}</small></div></div><span className={`status-badge ${post.status}`}>{post.status}</span><span className="post-date">{post.updatedAt ? new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "Original guide"}</span><button className="edit-post" onClick={() => open(post)} aria-label={`Edit ${post.title}`}><PenLine size={17}/></button></div>) : <div className="posts-empty"><BookOpen size={30}/><h2>{query ? "No matching stories" : "Your next story is waiting"}</h2><p>{query ? "Try a different search." : "Create a post to get started."}</p></div>}<footer className="posts-footer">{shown.length} {shown.length === 1 ? "post" : "posts"}<span>Made to inspire. Ready to share.</span></footer></section><div className="admin-tip"><span>?</span><p><strong>A little inspiration goes a long way.</strong> Share a design tip, a behind-the-scenes story, or a guide to finding the perfect patch.</p></div></>}</main><footer className="admin-footer">CUSTOM PATCH AMERICA<span>Content workspace</span></footer></div></div>;
}
