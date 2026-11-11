import type { OptionGroup } from "./embroidered";

export interface ServiceImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface HeroContent {
  id: string;
  badge: string;
  heading: [string, string];
  lead: string;
  paragraphs: [string, string];
  image: ServiceImage;
}

export interface SectionContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ApplicationsContent extends SectionContent {
  label: string;
  items: { title: string; description: string; image: ServiceImage; icon: "shield" | "bike" | "trophy" | "building" | "shirt" }[];
}

export interface BenefitsContent {
  title: string;
  intro: string;
  benefits: string[];
  conclusion: string;
  image: ServiceImage;
}

export interface OptionsContent extends SectionContent {
  groups: OptionGroup[];
  centerCards?: boolean;
}

export interface CTAContent {
  heading: [string, string];
  description: string;
}

export interface DetailContent extends SectionContent {
  label: string;
  cards: { title: string; description: string; image: ServiceImage }[];
  note: string;
}

export interface StoryContent {
  heading: [string, string];
  subheading?: string;
  paragraphs: string[];
  image: ServiceImage;
  enlargeDesktopImage?: boolean;
}
