import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listPosts } from "@/lib/blog-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await listPosts()).find(post => post.slug === slug);
  return post ? { title: `${post.title} | Custom Patch America`, description: post.excerpt } : {};
}
export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const post = (await listPosts()).find(post => post.slug === slug);
  if (!post) notFound();
  return <div id="top"><Header servicePage /><main className="mx-auto max-w-[900px] px-6 py-12 sm:py-16">
    <Link href="/blog" className="text-sm font-semibold text-[#0963d6]">&larr; All guides</Link>
    <article className="mt-8"><p className="text-xs font-bold uppercase tracking-wider text-[#0963d6]">{post.category}</p><h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{post.title}</h1><p className="mt-5 text-lg leading-8 text-[#587092]">{post.excerpt}</p>
      <div className="my-9 flex justify-center rounded-3xl bg-[#f1f7ff] p-8"><Image src={post.image} alt="Custom patch example" width={280} height={280} className="h-[240px] w-[240px] object-contain" /></div>
      <div className="space-y-9">{post.sections.map((section, index) => <section key={index}><h2 className="text-2xl font-bold">{section.heading}</h2><p className="mt-3 whitespace-pre-wrap break-words text-base leading-8 text-[#496184]">{section.text}</p></section>)}</div>
      <div className="mt-12 rounded-2xl border border-[#dce8f6] bg-[#f7faff] p-7"><h2 className="text-xl font-bold">Ready for the next step?</h2><p className="mt-2 text-sm leading-6 text-[#587092]">Explore your options or tell us about your project.</p><div className="mt-5 flex flex-wrap gap-5"><Link href={post.service} className="font-bold text-[#0963d6] underline underline-offset-4">Explore options</Link><Link href="/contact-us" className="font-bold text-[#0963d6] underline underline-offset-4">Contact us</Link></div></div>
    </article>
  </main><Footer servicePage /></div>;
}