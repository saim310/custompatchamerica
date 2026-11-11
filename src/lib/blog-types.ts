export type BlogPost = {
  slug: string; title: string; category: string; image: string; excerpt: string;
  service: string; sections: { heading: string; text: string }[];
  status: "draft" | "published"; updatedAt: string; revision: string;
};
