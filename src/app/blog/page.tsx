import PageBanner from "@/components/PageBanner";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Patch Guides & Design Tips | Custom Patch America Blog",
  description: "Explore custom patch guides, backing options, and artwork tips for your next project.",
};

export default async function BlogPage() {
  const posts = await listPosts();
  return (
    <div id="top" className="overflow-x-clip">
      <Header servicePage />
      <main>
        <PageBanner badge="The patch journal" heading={["Small patches.", "Big ideas."]} lead="Inspiration for your next custom patch." description="Explore design inspiration, practical guides, and the details that help bring your custom patches to life." primary={{ label: "Explore the guides", href: "#articles-heading" }} secondary={{ label: "Tell us your idea", href: "/contact-us" }} />
        <section aria-labelledby="articles-heading" className="mx-auto max-w-[1280px] px-6 py-14 sm:py-20">
          <h2 id="articles-heading" className="mb-7 text-2xl font-bold">Latest guides</h2>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => <article key={post.slug} className="group overflow-hidden rounded-2xl border border-[#dce8f6] bg-white shadow-[0_10px_30px_#12305508]">
              <Link href={`/blog/${post.slug}`} className="block h-full focus-visible:outline-2 focus-visible:outline-[#0963d6]">
                <div className="flex h-[250px] items-center justify-center bg-[linear-gradient(135deg,#f1f7ff,#fafcff)] p-7"><Image src={post.image} alt={`${post.category} illustration featuring a custom patch`} width={240} height={240} sizes="(max-width: 767px) 240px, 220px" className="h-full w-auto object-contain transition-transform group-hover:scale-105 motion-reduce:transition-none" /></div>
                <div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#0963d6]">{post.category}</p><h3 className="mt-3 text-xl font-bold leading-snug text-navy group-hover:text-[#0963d6]">{post.title}</h3><p className="mt-3 text-sm leading-6 text-[#587092]">{post.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0963d6]">Read guide <ArrowRight size={17} aria-hidden="true" /></span></div>
              </Link>
            </article>)}
          </div>
          <div className="mt-14 rounded-3xl bg-navy px-7 py-10 text-center text-white"><h2 className="text-2xl font-bold">Have an idea for your next patch?</h2><p className="mt-3 text-[#c1d2e8]">Tell us about your design and we&apos;ll help you take the next step.</p><Link href="/contact-us" className="mt-6 inline-block rounded-lg bg-brand-red px-6 py-3 font-bold text-white hover:bg-[#d91825]">Let&apos;s talk patches</Link></div>
        </section>
      </main>
      <Footer servicePage />
    </div>
  );
}