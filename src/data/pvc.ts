import type { ApplicationsContent, BenefitsContent, CTAContent, DetailContent, HeroContent, OptionsContent, StoryContent } from "./service-page";

const asset = (name: string) => `/images/pvc/${name}.webp`;
const image = (name: string, alt: string) => ({ src: asset(name), alt, width: 800, height: 800 });

export const hero: HeroContent = {
  id: "pvc-heading",
  badge: "Your identity. Built for the everyday.",
  heading: ["Custom PVC", "Patches"],
  lead: "Built Tough, Designed to Last Longer",
  paragraphs: [
    "Bring your artwork into focus with flexible, rubber-like PVC and clean molded detail. A water-resistant surface and durable construction make these patches a practical choice for everyday wear and outdoor use.",
    "Create a distinctive finish for uniforms, bags, jackets and tactical gear. Choose a flat 2D design or raised 3D relief, then customize the shape, colors and attachment to suit your project.",
  ],
  image: image("hero", "Premium PVC patch collection with navy mountain, olive compass, charcoal geometric emblem and muted burgundy falcon designs"),
};

export const applications: ApplicationsContent = {
  label: "PVC patch applications",
  eyebrow: "Custom PVC Patches for Every Need",
  title: "Durable, Flexible Patches Made to Face Tough Conditions",
  description: "Give your identity a durable molded finish. From branded apparel to outdoor equipment, flexible PVC adds clear detail and character to the pieces you use every day.",
  items: [
    { title: "Branding & Logo Patches", description: "Make your brand recognizable with crisp raised lines, defined color boundaries and a clean custom shape. Add a professional logo patch to uniforms, branded bags or promotional apparel.", icon: "building", image: image("branding-logo", "Charcoal rectangular PVC logo patch with raised cream interlocking geometric artwork and a muted burgundy accent") },
    { title: "Tactical & Outdoor Gear Patches", description: "Equip backpacks, utility jackets and tactical gear with a durable, water-resistant PVC emblem. Molded mountain, compass and expedition designs give outdoor equipment a clear personal identity.", icon: "shield", image: image("tactical-outdoor", "Hexagonal olive, charcoal and sand PVC outdoor patch with a molded compass, mountain ridge and recessed terrain contours") },
    { title: "Fashion & Lifestyle Patches", description: "Put a contemporary signature on jackets, caps and everyday accessories. Refined graphics, restrained colors and dimensional rubber details bring a distinctive finish to your collection.", icon: "shirt", image: image("fashion-lifestyle", "Custom-shaped burgundy and cream PVC streetwear emblem with offset architectural arches and recessed channels") },
  ],
};

export const benefits: BenefitsContent = {
  title: "Why Choose Our Custom PVC Patches?",
  intro: "A good PVC patch balances flexible construction with thoughtful design. We help translate your artwork into clean molded shapes, defined details and a finish that suits the way you will use it.",
  benefits: [
    "Affordable Pricing — a quote tailored to your design and quantity",
    "High-Quality Build — durable, flexible PVC with clean molded detail",
    "Free Digital Mockup — review the design before production",
    "Minimum Order: 10 Pieces — start with a small custom run",
    "Fast Shipping — confirm available shipping options with your quote",
    "Multiple Shapes & Sizes — a custom outline that fits your artwork",
  ],
  conclusion: "Share your artwork, quantity and deadline. We will confirm the attachment, design details, pricing and production schedule for your project without assuming a one-size-fits-all finish.",
  image: image("why-choose", "Custom wolf-head PVC patch with sculpted charcoal and warm-grey rubber planes, navy recesses and subtle sand highlights"),
};

export const options: OptionsContent = {
  eyebrow: "PVC Patch Finishing",
  title: "Backing, Materials & Border Options",
  description: "Choose an attachment that fits your application, a flexible PVC foundation and an edge molded to complement your artwork.",
  centerCards: true,
  groups: [
    {
      id: "backing", label: "Backing Options",
      description: "Choose permanent stitching, temporary adhesive or a removable fixing. We will confirm compatibility with your garment or equipment before production.",
      items: [
        { name: "Sew-On", description: "A recessed sewing channel provides a defined path for stitching your PVC patch securely to jackets, uniforms or bags.", image: asset("backing-sew-on"), alt: "Navy PVC mountain patch with a recessed sewing channel and a short sample of cream attachment stitches" },
        { name: "Peel and Stick", description: "A peel-away liner exposes adhesive for temporary placement on a suitable surface. Best suited to short-term applications.", image: asset("backing-peel-stick"), alt: "Reverse of a charcoal PVC patch with a cream release liner peeled back to expose adhesive" },
        { name: "Magnetic or Clip Fixing", description: "A magnetic attachment or a mechanical clip offers removable placement without sewing. The fixing is selected to suit your intended use.", image: asset("backing-magnetic-clip"), alt: "Two PVC patch backs showing a magnetic pad with separate keeper plate and a distinct metal garment clip" },
        { name: "Velcro / Hook-and-Loop", description: "A hook backing pairs with a matching loop panel so your patch can be removed and exchanged on compatible gear.", image: asset("backing-hook-loop"), alt: "Rectangular PVC patch with a black hook backing and a separate matching soft loop receiver" },
      ],
    },
    {
      id: "materials", label: "Premium Base Materials",
      description: "Soft PVC is the foundation of these molded patches. The flat 2D and raised 3D options describe design relief, not different fabric or yarn bases.",
      items: [
        { name: "Soft PVC", description: "Flexible polyvinyl chloride forms both the supportive base and molded design. Its rubber-like feel, clean color separation and water-resistant surface suit apparel and outdoor gear.", image: asset("material-soft-pvc"), alt: "Flexible charcoal soft PVC material sample with a gently curled corner, solid rubber sidewall and sand molded ridges" },
      ],
    },
    {
      id: "borders", label: "Border Options",
      description: "PVC edges are formed as part of the molded patch. Choose a raised frame, a recessed sewing channel or a custom outline; final construction depends on the design and attachment.",
      items: [
        { name: "Raised Molded Border", description: "An integrated raised rubber rim frames the artwork with a clearly defined edge and a dimensional finish.", image: asset("border-raised"), alt: "Olive hexagonal PVC peak patch with a continuous raised charcoal molded rim" },
        { name: "Recessed Sewing Channel", description: "A narrow molded groove around the perimeter creates space for stitching without crossing the raised artwork.", image: asset("border-sewing-channel"), alt: "Warm-grey and navy PVC trail patch with an empty recessed sewing channel along its perimeter" },
        { name: "Custom-Shaped Edge", description: "A precise molded outline follows your artwork, from angular emblems to more distinctive silhouettes.", image: asset("border-custom-shape"), alt: "Charcoal and sand falcon-wing PVC patch with an integral molded edge following the feather silhouette" },
      ],
    },
  ],
};

export const cta: CTAContent = {
  heading: ["Explore Our Premium", "PVC Patch Designs"],
  description: "Give your next project a durable, flexible molded finish. From outdoor gear to branded jackets, customize the shape, colors and depth of your PVC patch to make every detail your own.",
};

export const details: DetailContent = {
  label: "PVC patch design options",
  eyebrow: "2D or 3D Molding",
  title: "Choose Your PVC Patch Design",
  description: "Use flat color planes for a clean graphic look, add sculpted relief for dimension, or explore the thickness and palette that best suit your artwork.",
  cards: [
    { title: "Flat 2D Design", description: "Level molded color areas and subtle stepped relief create clear boundaries and a clean, graphic finish.", image: image("flat-2d", "Flat 2D PVC mountain and river patch with navy, grey and sand color planes and shallow uniform relief") },
    { title: "Raised 3D Design", description: "Sculpted, multi-level rubber details bring rounded contours and visible depth to your custom design.", image: image("raised-3d", "Raised 3D PVC ram-head shield with sculpted horns, dimensional facial contours and a recessed charcoal field") },
    { title: "Thickness and Colors", description: "Balance material depth and flexibility with a coordinated color palette. Final thickness is chosen around your design and application.", image: image("thickness-colors", "Three matching PVC chevron patches in olive, navy and sand shown at low angles to compare colors and molded sidewall depth") },
  ],
  note: "Illustrative design examples, not measured thickness samples. Available detail, depth and color combinations are confirmed with your artwork review.",
};

export const story: StoryContent = {
  heading: ["The Strength and Flexibility", "of Custom PVC Patches"],
  subheading: "The Craft and Precision Behind Perfectly Molded Designs",
  paragraphs: [
    "The character of a PVC patch comes from the mold: a precise outline, cleanly separated colors and carefully planned levels of relief. Small changes in depth help a line, contour or emblem stand out without overwhelming the design.",
    "Flexible, rubber-like PVC gives that artwork a durable foundation. A flat graphic finish or sculpted 3D surface can be paired with an attachment that fits your uniforms, jackets, bags or outdoor equipment.",
    "Start with your idea and an order of 10 pieces or more. We will help refine the shape, scale and finishing details so your patch feels considered from its first mockup to its final molded edge.",
  ],
  image: image("story-collage", "Balanced collection of four matte PVC patches with mountain-goat, wave, trail and falcon designs in sand, navy, olive and muted burgundy"),
};
