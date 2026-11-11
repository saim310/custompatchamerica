import type { ServiceImage } from "@/data/service-page";
import EmbroideredHero from "@/components/services/embroidered/EmbroideredHero";

interface PageBannerProps {
  image?: ServiceImage;
  badge: string;
  heading: [string, string];
  lead: string;
  description: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export default function PageBanner({ image, badge, heading, lead, description, primary, secondary }: PageBannerProps) {
  return <EmbroideredHero
    background="gradient"
    content={{
      id: "page-heading",
      badge,
      heading,
      lead,
      paragraphs: [description, ""],
      image: image ?? {
        src: "/images/embroidered/hero-patches.webp",
        alt: "Embroidered compass, mountain, tiger, and floral patch collection",
      },
    }}
    primary={primary}
    secondary={secondary}
  />;
}