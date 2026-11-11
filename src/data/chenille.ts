import { asset as backingAsset, optionGroups } from "./embroidered";
import type { ApplicationsContent, BenefitsContent, CTAContent, DetailContent, HeroContent, OptionsContent, StoryContent } from "./service-page";

const asset = (name: string) => `/images/chenille/${name}.webp`;
const image = (name: string, alt: string) => ({ src: asset(name), alt, width: 800, height: 800 });

export const hero: HeroContent = {
  id: "chenille-heading",
  badge: "Your identity. A softer, bolder statement.",
  heading: ["Custom Chenille", "Patches"],
  lead: "Bold Texture. Soft, Raised Finish. Classic Varsity Spirit.",
  paragraphs: [
    "Give your design a little more dimension. Our custom chenille patches pair plush, raised yarn with rich colors and a soft finish that stands out on varsity jackets, hoodies and everyday apparel.",
    "From school letters and team emblems to statement fashion designs, create a distinctive patch for caps, bags and uniforms. Choose the shape, size and finishing details that make it yours.",
  ],
  image: image("hero", "Colorful custom chenille patch collection with a red varsity letter, gold star, green lightning bolt, athletic wing and sunrise badge"),
};

export const applications: ApplicationsContent = {
  label: "Chenille patch applications",
  eyebrow: "Custom Chenille Patches for Every Need",
  title: "Make Your Identity Stand Out in Soft, Bold Texture",
  description: "Celebrate a milestone, build a team identity or add a statement to your collection. Raised chenille brings warmth and character to the things you wear.",
  items: [
    { title: "School & Varsity Patches", description: "Show your school pride with plush varsity letters and achievement patches. Add a personal milestone to letterman jackets, celebrate student success or bring a coordinated look to school uniforms.", icon: "building", image: image("school-varsity", "Ruby-red chenille varsity letter V with layered ivory and navy felt and a gold achievement star") },
    { title: "Fashion & Streetwear Patches", description: "Turn hoodies, caps and casual wear into statement pieces. Rich colors and tactile chenille shapes give your brand a bold signature that feels as distinctive as it looks.", icon: "shirt", image: image("fashion-streetwear", "Coral, gold and turquoise flame-shaped chenille streetwear patch with a layered navy felt outline") },
    { title: "Team & Club Patches", description: "Bring your sports team, club or event crew together with a shared emblem. Custom chenille badges add a proud, recognizable identity to team jackets, bags and group apparel.", icon: "trophy", image: image("team-club", "Emerald, gold and navy shield-shaped chenille team patch with a raised star and ivory chevrons") },
  ],
};

export const benefits: BenefitsContent = {
  title: "Why Choose Our Custom Chenille Patches?",
  intro: "Chenille is made to be noticed and felt. Soft loops of yarn create a dimensional surface, while a supportive base gives each patch its shape and substance.",
  benefits: [
    "Plush, raised texture with a premium yarn feel",
    "Vivid color combinations that bring bold designs to life",
    "Durable construction with finishing suited to your apparel",
    "A free digital mockup to review your custom design",
    "Fast turnaround and shipping options for your schedule",
    "Affordable pricing tailored to your design and quantity",
  ],
  conclusion: "Share your artwork, quantity and deadline. We will help you choose a practical size and finish, and confirm pricing and timing with your quote.",
  image: image("why-choose", "Premium ivory varsity C, red and gold lightning bolt and emerald star chenille patches showing raised yarn and layered felt"),
};

export const options: OptionsContent = {
  eyebrow: "Make Every Detail Your Own",
  title: "Chenille Backing, Materials & Borders",
  description: "Match that soft, dimensional finish with the right foundation, attachment and edge. We will help you choose options that suit your design and garment.",
  groups: [
    {
      id: "backing", label: "Backing Options",
      description: "Select a secure sewn attachment, heat-applied backing or a removable option. Suitability depends on your fabric, patch size and intended use.",
      // These reverse-side backing illustrations are intentionally shared across service pages.
      items: optionGroups[0].items.map((item, index) => ({ ...item, name: ["Sew-On", "Iron-On", "Peel and Stick", "Velcro / Hook-and-Loop"][index], image: backingAsset(item.image) })),
    },
    {
      id: "materials", label: "Premium Base Materials",
      description: "Explore the soft foundation, durable support and raised yarn surface that give a chenille patch its distinctive feel.",
      items: [
        { name: "Felt Fabric", description: "A thick, soft foundation that supports bold raised chenille designs and creates a distinctive layered outline.", image: asset("material-felt"), alt: "Layered ivory, crimson and navy felt swatches with a raised gold chenille star sample" },
        { name: "Polyester Twill", description: "A durable support fabric for customized chenille patches, especially designs combining plush yarn with finer embroidered accents.", image: asset("material-polyester-twill"), alt: "Navy polyester twill support swatch with diagonal weave beside a raised red chenille sample" },
        { name: "Acrylic Yarn Surface", description: "Soft, raised acrylic yarn forms the plush surface that gives chenille its classic texture, depth and bold character.", image: asset("material-acrylic-yarn"), alt: "Golden acrylic chenille loop-pile yarn surface on ivory felt with a matching loose yarn sample" },
      ],
    },
    {
      id: "borders", label: "Border Options",
      description: "Frame a classic shape with an overlocked edge, or follow a custom silhouette with a precise cut. Available finishes depend on the base fabric and design.",
      items: [
        { name: "Merrowed Edge", description: "A rounded, overlocked thread border gives simple shapes a substantial, neatly framed finish.", image: asset("border-merrowed"), alt: "Round emerald chenille star patch with a thick navy overlocked merrowed border" },
        { name: "Heat Cut Edge", description: "A slim, heat-sealed edge on a compatible synthetic base keeps the outline clean without a bulky rolled border.", image: asset("border-heat-cut"), alt: "Red chenille lightning patch with a narrow heat-cut navy perimeter" },
        { name: "Laser Cut Edge", description: "A precise cut follows custom letters and detailed silhouettes for a clean, closely shaped outline.", image: asset("border-laser-cut"), alt: "Gold star and turquoise lightning chenille patch with a precise custom laser-cut outline" },
      ],
    },
  ],
};

export const cta: CTAContent = {
  heading: ["Bold Texture. Premium Chenille.", "Made for Your Next Big Idea."],
  description: "Create a custom chenille design for varsity jackets, hoodies, backpacks or your next fashion collection. Bring your brand or team together with a patch that stands out in every dimension.",
};

export const details: DetailContent = {
  label: "Chenille patch styles",
  eyebrow: "Find Your Chenille Style",
  title: "From All-Over Plush to the Perfect Mix",
  description: "Choose a fully textured finish or combine raised yarn with finer embroidery. Each style gives your artwork a different balance of softness, depth and detail.",
  cards: [
    { title: "Full Chenille", description: "A soft, raised chenille look with full plush texture. Ideal for bold letters and simple shapes that let the yarn take center stage.", image: image("style-full-chenille", "Full chenille gold star with a completely plush yarn face and layered cobalt and ivory felt") },
    { title: "Chenille with Embroidery", description: "Combine chenille softness with embroidered detail accents, adding crisp outlines and smaller decorative elements to a plush design.", image: image("style-chenille-embroidery", "Emerald chenille patch with a raised gold star and smooth embroidered ivory laurel accents") },
    { title: "Mixed Design", description: "Pair chenille letters or shapes with an embroidered background and supporting details for a layered, dimensional statement.", image: image("style-mixed-design", "Raised red chenille varsity M on a navy embroidered shield with gold rays and ivory stitched stars") },
  ],
  note: "Illustrative design examples. Final texture, detailing and available finishes depend on your artwork, patch size and chosen materials.",
};

export const story: StoryContent = {
  heading: ["Texture You Can Feel.", "Craftsmanship You Can See."],
  paragraphs: [
    "A chenille patch has a character all its own. Raised loops of yarn catch the light, soften an outline and turn a familiar letter or shape into something with real depth.",
    "That character starts with thoughtful construction: a supportive base, carefully chosen yarn colors and a cleanly finished edge. Add embroidered accents where your design needs a finer touch, while keeping that unmistakable plush texture at its heart.",
    "From varsity jackets and team uniforms to hoodies, bags and fashion collections, chenille gives everyday pieces a personal story. Share your idea and we will help you find the shape, scale and finish that bring it to life.",
  ],
  image: image("story", "Rich collage of custom chenille varsity letters, a heart, star, shield, sunburst and lightning patch in red, emerald, cobalt and gold"),
};
