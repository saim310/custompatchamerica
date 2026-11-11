import { asset as backingAsset, optionGroups } from "./embroidered";
import type { ApplicationsContent, BenefitsContent, CTAContent, DetailContent, HeroContent, OptionsContent, StoryContent } from "./service-page";

const asset = (name: string) => `/images/woven/${name}.webp`;

export const hero: HeroContent = {
  id: "woven-heading",
  badge: "Your identity. Woven into every detail.",
  heading: ["Custom Woven", "Patches"],
  lead: "Woven to Detail, Capture Precision with Softness",
  paragraphs: [
    "Bring intricate artwork to life with fine woven threads, sharp details and a smooth, flat finish. From small lettering to detailed brand marks, custom woven patches make every part of your design count.",
    "Create lightweight, durable patches for uniforms, clothing, hats and accessories—with custom shapes, sizing and backing options to suit your brand, team or organization.",
  ],
  image: { src: asset("hero"), alt: "Collection of custom woven patches with mountain, compass, wildlife and outdoor brand designs", width: 1200, height: 951 },
};

export const applications: ApplicationsContent = {
  label: "Woven patch applications",
  eyebrow: "Custom Woven Patches for Every Purpose",
  title: "Crisp, Detailed Woven Patches Designed to Inspire Viewers",
  description: "Tell us how you plan to use your woven patches. We’ll help you choose the design details, shape and backing that bring your identity to life.",
  items: [
    { title: "Branding & Logo Patches", description: "Promote your brands, companies, organizations and events through customizing woven patches with your logos.", icon: "building", image: { src: asset("branding"), alt: "Navy and gold Apex Solutions woven logo patch with geometric artwork and small lettering", width: 800, height: 1001 } },
    { title: "Fashion & Lifestyle Patches", description: "Wear our durable woven patches on your jackets, caps or streetwear to catch people’s attention in bold styles.", icon: "shirt", image: { src: asset("fashion"), alt: "Street Style woven fashion patch with detailed urban artwork in olive and warm neutral colors", width: 800, height: 1000 } },
    { title: "Club, Team & Organization Patches", description: "Bring your group together with personalized woven patches made for team uniforms, club clothing and everyday gear.", icon: "trophy", image: { src: asset("team"), alt: "Navy, ivory and red Raiders woven team patch with a custom cut script outline", width: 800, height: 616 } },
  ],
};

export const benefits: BenefitsContent = {
  title: "Why Choose Our Custom Woven Patches?",
  intro: "Fine threads are woven together to form your design, creating a smooth, flexible patch with clear detail. It’s a natural fit for artwork that needs precision without a raised finish.",
  benefits: [
    "Fine woven detail for intricate logos and artwork",
    "Smooth, flat texture that sits comfortably on clothing",
    "Clear small lettering, sized to suit your design",
    "Durable construction for uniforms and everyday wear",
    "Custom shapes, sizes and flexible backing options",
    "Careful artwork review and consistent production quality",
  ],
  conclusion: "We’ll help you balance detail, size and color so your woven patch stays recognizable—from the first digital mockup to the finished piece.",
  image: { src: asset("why-choose-woven"), alt: "Flat navy and ivory woven compass patch showing fine geometric lines and closely interlaced threads", width: 800, height: 800 },
};

export const options: OptionsContent = {
  eyebrow: "Woven Patch Finishing",
  title: "Backing and Border Options",
  description: "Choose the attachment, woven materials and edge finish that suit your design and the way you’ll wear your patch.",
  centerCards: true,
  groups: [
    {
      id: "backing", label: "Backing Options",
      description: "Choose a permanent attachment or a removable backing to match your fabric and application.",
      items: optionGroups[0].items.map((item, index) => ({ ...item, name: ["Sew-On", "Iron-On", "Peel and Stick", "Velcro / Hook-and-Loop"][index], image: backingAsset(item.image) })),
    },
    {
      id: "materials", label: "Premium Base Materials",
      description: "Fine woven polyester threads form a smooth textile surface that brings small lettering and detailed artwork into focus.",
      items: [
        { name: "Woven Polyester Base", description: "A durable, flexible woven polyester structure that gives your patch a smooth, stable foundation.", image: asset("polyester-base-woven"), alt: "Ivory woven polyester fabric swatch showing its fine interlaced textile structure" },
        { name: "Fine Thread Fabric", description: "Closely interlaced fine threads help reproduce small lettering, clean lines and intricate designs in a flat finish.", image: asset("fine-thread-woven"), alt: "Navy and ivory fine-thread woven fabric with a small geometric pattern" },
      ],
    },
    {
      id: "borders", label: "Border Options",
      description: "Finish a simple shape with a rounded edge, or choose a clean sealed cut for a slimmer outline.",
      items: [
        { name: "Merrowed Edge", description: "A rounded overlocked edge that frames the woven design, best suited to circles, ovals and other simple shapes.", image: asset("fine-weave"), alt: "Ivory overlocked edge framing a flat woven mountain patch" },
        { name: "Heat Cut Edge", description: "A slim, heat-sealed edge that finishes the woven fabric without adding a thick overlocked border.", image: asset("heat-cut"), alt: "Close view of a woven patch with a slim heat-sealed edge" },
        { name: "Laser Cut Edge", description: "A precise sealed cut that follows detailed custom outlines and keeps the edge clean and lightweight.", image: asset("laser-cut"), alt: "Custom-shaped woven patch with a precise laser-cut outline" },
      ],
    },
  ],
};

export const cta: CTAContent = {
  heading: ["Premium Woven Patch Designs,", "Made Just for You"],
  description: "Give your logo, artwork or team identity a smooth, finely detailed finish. Share your idea and let’s create a custom woven patch for your clothing, uniforms or accessories.",
};

export const details: DetailContent = {
  label: "Woven weave detail options",
  eyebrow: "Design Options for Woven Patches",
  title: "Find the Right Detail Level for Your Design",
  description: "Explore how simple shapes, balanced artwork and intricate linework translate into woven patches. We’ll help match the level of detail to your design and finished size.",
  cards: [
    { title: "Fine Detail Weave", description: "Keep a simple logo clear and readable with clean shapes, light detailing and a smooth woven surface.", image: { src: asset("fine-weave"), alt: "Fine-detail woven patch with a simple navy mountain silhouette and orange sun" } },
    { title: "Balanced Weave", description: "Combine defined artwork with open areas for a balanced design that stays recognizable on clothing and gear.", image: { src: asset("balanced-weave"), alt: "Balanced woven mountain patch combining landscape details, pine trees and open sky" } },
    { title: "High Detail Weave", description: "Bring intricate artwork and fine lines into focus, with detail adjusted to suit your patch size and design.", image: { src: asset("high-detail-weave"), alt: "High-detail woven landscape patch with fine mountain contours and small pine trees" } },
  ],
  note: "Illustrative design examples. Achievable detail and lettering size depend on your artwork and finished patch dimensions.",
};

export const story: StoryContent = {
  heading: ["The Detail and Precision", "of Custom Woven Patches"],
  paragraphs: [
    "The character of a woven patch is in the details: fine threads, crisp shapes and a smooth surface that lets your artwork speak. Even a small patch can carry a distinctive identity.",
    "We consider your whole design—from the smallest lettering to its outer shape. Thoughtful color choices, a suitable weave and a carefully finished edge bring those details together.",
    "For uniforms, jackets, bags or branded apparel, choose the size and attachment that fit your project. We’ll help turn your idea into a woven patch that feels like your own.",
  ],
  image: { src: asset("story"), alt: "Collage of finished woven outdoor and apparel logo patches in varied shapes and colors", width: 1200, height: 800 },
  enlargeDesktopImage: true,
};
