import type { ApplicationsContent, BenefitsContent, CTAContent, DetailContent, HeroContent, OptionsContent, StoryContent } from "./service-page";

export const applications = [
  { title: "Military Patches", description: "Represent your units, ranks, identity and achievements with custom embroidered patches for military and army uniforms.", image: "military-patch", alt: "Original navy, olive and gold embroidered military-inspired insignia" },
  { title: "Biker & Fashion Patches", description: "Style your outfits with stunning custom embroidered patches for motorcycle clubs and fashion clothing.", image: "biker-patch", alt: "Black, cream and red embroidered biker patch with winged motorcycle artwork" },
  { title: "School & Sports Patches", description: "Order our personalized embroidered patches for your school uniforms, sports jerseys, or gear.", image: "sports-patch", alt: "Gold and navy embroidered tiger mascot sports team patch" },
];

export interface PatchOption { name: string; description: string; image: string; alt: string }
export interface OptionGroup { id: string; label: string; description: string; items: PatchOption[] }
export const optionGroups: OptionGroup[] = [
  { id: "backing", label: "Backing Options", description: "Choose how your patch attaches. We’ll help you find the right backing for your fabric, application and everyday use.", items: [
    { name: "No Backing / Sew-On", description: "A flexible fabric reverse for a secure, permanent stitched attachment.", image: "backing-sew-on", alt: "Uncoated fabric reverse of a sew-on patch with visible stitching" },
    { name: "Iron-On", description: "Heat-activated adhesive for compatible fabrics. Stitch for extra durability.", image: "backing-iron-on", alt: "Smooth heat-activated adhesive film on the reverse of a patch" },
    { name: "Peel-and-Stick", description: "A peel-away liner and adhesive for temporary, easy placement.", image: "backing-adhesive", alt: "Partially lifted protective liner revealing a patch’s adhesive backing" },
    { name: "Double Velcro / Hook-and-Loop", description: "Matching hook and loop layers for removable, interchangeable patches.", image: "backing-velcro", alt: "Separated hook and loop backing discs showing both attachment layers" },
  ] },
  { id: "materials", label: "Premium Base Materials", description: "The foundation matters. Select a durable twill base, then pair it with the backing that suits your project.", items: [
    { name: "Twill", description: "A durable woven base with a subtle diagonal texture, ideal for exposed fabric areas.", image: "material-twill", alt: "Navy twill base fabric with visible diagonal woven ribs" },
    { name: "Adhesive-Backed Twill", description: "Twill paired with a pressure-sensitive adhesive backing for temporary attachment.", image: "backing-adhesive", alt: "Twill patch with peel-away adhesive backing" },
  ] },
  { id: "borders", label: "Border Options", description: "Finish your design with a classic raised edge, a precise stitched outline, or a clean cut that follows your artwork.", items: [
    { name: "Merrowed Border", description: "A thick, rounded overlocked edge, best suited to simple patch shapes.", image: "border-merrowed", alt: "Thick gold overlocked merrowed border around a round patch" },
    { name: "Embroidered Border", description: "A clean satin-stitch outline that follows more detailed patch shapes.", image: "border-embroidered", alt: "Flat gold satin-stitch border following a shield-shaped patch" },
    { name: "No Border / Laser-Cut Edge", description: "A neat, heat-sealed cut for intricate outlines without an added stitched border.", image: "border-laser-cut", alt: "Thin laser-cut edge following a mountain-shaped embroidered patch" },
  ] },
];

export const coverageOptions = [
  { percent: 50, description: "Let the twill show through. Ideal for simple logos and lettering, with approximately half of the patch face covered in stitching." },
  { percent: 75, description: "Add more texture and detail. Most of the patch is embroidered, with selected areas of the twill base still visible." },
  { percent: 100, description: "Thread from edge to edge. Full embroidery covers the base fabric for a rich, textured finish across the entire design." },
];

export const asset = (name: string) => `/images/embroidered/${name}.webp`;

// Defaults preserve the existing embroidered page when no content prop is supplied.
export const heroContent: HeroContent = {
  id: "embroidered-heading",
  badge: "Your identity. Beautifully stitched.",
  heading: ["Custom Embroidered", "Patches"],
  lead: "Made for your story. Built to stand out.",
  paragraphs: [
    "Bring your ideas to life with the timeless texture of custom embroidery. From a bold team emblem to the smallest brand detail, every stitch makes your design your own.",
    "Create durable, high-quality patches for uniforms, businesses, clubs and teams—with your choice of shape, colors, coverage and backing.",
  ],
  image: { src: asset("hero-patches"), alt: "Original embroidered compass insignia, mountain landscape, tiger crest and floral patches with detailed raised stitching" },
};

export const applicationsContent: ApplicationsContent = {
  label: "Embroidered patch applications",
  eyebrow: "Custom Embroidered Patches for Every Need",
  title: "Durable, High-Quality Patches Designed to Stand Out",
  description: "No matter what type of custom embroidered patch you need, we customize every style with passion. Our dedicated team of embroidered patch designers understands your requirements very well.",
  items: applications.map((item, index) => ({ title: item.title, description: item.description, image: { src: asset(item.image), alt: item.alt }, icon: (["shield", "bike", "trophy"] as const)[index] })),
};

export const benefitsContent: BenefitsContent = {
  title: "Why Choose Our Custom Embroidered Patches?",
  intro: "Great patches do more than carry a logo. They bring people together, tell a story and stay with you through everyday wear.",
  benefits: ["Quality threads with rich, lasting color", "Precise stitching and carefully finished edges", "Custom shapes, sizes and color combinations", "Backing options for the way you wear your patch", "Free design support and a digital mockup", "Personal support from idea to finished patch"],
  conclusion: "Whether you’re outfitting a whole team or creating something personal, we give your design the attention it deserves.",
  image: { src: asset("why-choose-patch"), alt: "Detailed embroidered mountain landscape showing precise threadwork and a neatly finished gold border" },
};

export const optionsContent: OptionsContent = {
  eyebrow: "Make It Your Own",
  title: "Backing and Border Options",
  description: "The right finish makes all the difference. Explore the materials, attachments and edges that complete your custom embroidered patch.",
  groups: optionGroups,
};

export const ctaContent: CTAContent = {
  heading: ["Premium Embroidered Patch Designs,", "Made Just for You"],
  description: "Your idea deserves a finish you can feel. Share your design and let’s create a custom embroidered patch with the detail, texture and character to make it stand out.",
};

export const detailContent: DetailContent = {
  label: "Embroidery coverage options",
  eyebrow: "Every Stitch Makes a Difference",
  title: "Choose Your Embroidery Coverage",
  description: "From the clean contrast of exposed twill to a fully stitched finish, choose the texture that brings out the best in your design.",
  cards: coverageOptions.map(option => ({
    title: `${option.percent}% Embroidery Coverage`, description: option.description,
    image: { src: asset(`coverage-${option.percent}`), alt: `The same mountain patch design with approximately ${option.percent}% embroidery coverage${option.percent === 100 ? ", including the entire background" : " and exposed twill background"}` },
  })),
  note: "Illustrative coverage comparison. Final stitch coverage depends on your artwork and patch size.",
};

export const storyContent: StoryContent = {
  heading: ["Crafted with Care.", "Recognized in Every Stitch."],
  paragraphs: [
    "There’s something unmistakable about an embroidered patch: the raised thread, the depth of color and the way a design becomes something you can hold. It’s a small detail with a lasting impression.",
    "We pay attention to the whole patch. Your artwork guides the stitch direction, thread choices and coverage, while a carefully chosen border gives every shape a clean finish.",
    "From uniforms and jackets to bags and team gear, your patch is made to express your identity. Choose the colors, size and attachment that work for you, and we’ll help bring the details together.",
  ],
  image: { src: asset("craftsmanship-patches"), alt: "Finished eagle, forest and floral embroidered patches showcasing precise stitching and dimensional threadwork" },
};
