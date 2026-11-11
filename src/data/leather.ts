import { asset as backingAsset } from "./embroidered";
import type { ApplicationsContent, BenefitsContent, CTAContent, DetailContent, HeroContent, OptionsContent, StoryContent } from "./service-page";

const asset = (name: string) => `/images/leather/${name}.webp`;
const image = (name: string, alt: string) => ({ src: asset(name), alt, width: 800, height: 800 });

export const hero: HeroContent = {
  id: "leather-heading",
  badge: "Rich texture. Distinctive character.",
  heading: ["Custom Leather", "Patches"],
  lead: "Designed to Impress, Built to Last",
  paragraphs: [
    "Give your brand a signature with genuine and synthetic leather patches. Rich grain, precise engraving and embossed details bring depth and character to a custom design.",
    "Create a polished finish for jackets, hats, bags, jeans and uniforms. Choose a shape, material and edge that complement your artwork, from a natural cognac badge to a printed leather label.",
  ],
  image: image("hero", "Four premium leather patches: a cognac engraved mountain rectangle, dark embossed motorcycle shield, tan compass hexagon and oxblood eagle oval"),
};

export const applications: ApplicationsContent = {
  label: "Leather patch applications",
  eyebrow: "Custom Leather Patches for Every Purpose",
  title: "Pick the Right Leather Patch Type for Your Design Ideas",
  description: "The right finish gives your artwork its own character. Explore crisp engraving, dimensional pressed details and tasteful printing on rich leather textures.",
  items: [
    { title: "Engraved Leather Patches", description: "Bring fine linework and heritage-inspired artwork into focus. Laser engraving marks the leather surface with a crisp design, with contrast shaped by the material and color you choose.", icon: "shield", image: image("engraved-leather", "Cognac hexagonal leather patch with dark laser-engraved mountain peaks, pine trees, a winding trail and compass details") },
    { title: "Embossed / Debossed Style", description: "Add a tactile signature to your patch. Embossing raises selected details while debossing presses them into the surface, giving bold artwork and simple marks a distinctive dimensional finish.", icon: "building", image: image("embossed-debossed", "Oxblood oval leather patch with raised oak leaves and acorns, a recessed decorative frame and burgundy perimeter stitching") },
    { title: "Printed Leather Badges", description: "Combine the character of leather with the flexibility of printed artwork. Carefully chosen colors and clean graphics give hats, bags and fashion collections a recognizable branded detail.", icon: "shirt", image: image("printed-leather", "Forest-green shield-shaped leather badge with cream, gold and navy printed mountain and river artwork and a warm sunset accent") },
  ],
};

export const benefits: BenefitsContent = {
  title: "Why Choose Our Custom Leather Patches?",
  intro: "A thoughtful leather patch brings material, artwork and finishing together. We help you choose a construction that suits your brand and the way your patches will be worn.",
  benefits: [
    "Affordable Prices — a quote matched to your design and quantity",
    "Premium Texture Finish — natural grain or a consistent synthetic surface",
    "Fast Shipping — confirm available delivery options with your quote",
    "Brand-Focused Designs — artwork shaped around your identity",
    "Free Digital Mockup — review the design before production",
    "Minimum Order: 10 Pieces — start with a small custom run",
  ],
  conclusion: "Share your artwork, preferred leather color and intended application. We will help you compare finishes and backing options, then confirm the details, pricing and timing for your order.",
  image: image("why-choose", "Caramel-tan leather shield with intricately engraved elk, pine forest and mountain sunrise, cream saddle stitching and a burnished edge"),
};

export const options: OptionsContent = {
  eyebrow: "Made to Suit Your Brand",
  title: "Backing, Materials & Border Options",
  description: "Choose the texture, attachment and finishing details that give your custom leather patch the right look and feel.",
  centerCards: true,
  groups: [
    {
      id: "backing", label: "Backing Options",
      description: "Match the attachment to your leather, garment and intended use. Heat application requires a suitable supplied backing and compatible materials; it is not appropriate for every leather patch.",
      items: [
        { name: "Sew-On", description: "Stitch through the prepared edge to attach your leather patch securely. Choose suitable stitching and placement for your garment or accessory.", image: asset("backing-sew-on"), alt: "Tan suede-like reverse of a leather sew-on patch with prepared stitching holes and a short cream stitch sample" },
        // These shared images illustrate attachment layers, not another service's patch face.
        { name: "Iron-On", description: "Available with a suitable supplied heat-activated backing. Confirm that both the selected leather and garment tolerate the specified application method before applying heat.", image: backingAsset("backing-iron-on"), alt: "Smooth heat-activated adhesive film illustrating an iron-on backing for compatible materials" },
        { name: "Peel and Stick", description: "A pressure-sensitive adhesive with a peel-away liner allows temporary placement on suitable surfaces. Adhesion depends on the surface, patch weight and intended use.", image: backingAsset("backing-adhesive"), alt: "Partially lifted protective liner revealing a pressure-sensitive adhesive backing" },
        { name: "Velcro / Hook-and-Loop", description: "Matching hook and loop layers let you remove and exchange your patch. The receiving garment or accessory needs a compatible attachment panel.", image: backingAsset("backing-velcro"), alt: "Separated hook and loop backing discs showing the two removable attachment layers" },
      ],
    },
    {
      id: "materials", label: "Premium Base Materials",
      description: "Natural grain and consistent manufactured textures offer different ways to express your design. We will confirm finish compatibility with your chosen material.",
      items: [
        { name: "Genuine Leather", description: "Natural grain and subtle variation give each patch individual character. Choose a suitable leather and color for the engraving, pressing or print finish you want.", image: asset("genuine-material"), alt: "Cognac and caramel genuine leather swatches with natural grain and a curled corner exposing the suede underside" },
        { name: "Synthetic Leather", description: "A leather-look material with a consistent grain and color offers a coordinated finish for branded collections. Available decoration methods depend on the selected material.", image: asset("synthetic-material"), alt: "Navy and oxblood synthetic leather swatches showing a consistent fine-grain face and a fabric-backed curled corner" },
      ],
    },
    {
      id: "borders", label: "Border Options",
      description: "Use a neat line of stitching to frame your design or a precise cut to follow its silhouette. Both finishes keep the leather surface at the center of the artwork.",
      items: [
        { name: "Stitched Edge", description: "A clean line of perimeter stitching complements the leather grain. Match the thread to the patch or choose a restrained contrast for a classic crafted look.", image: asset("border-stitched"), alt: "Chocolate leather label with a subtle gold compass and wave design, cream perimeter saddle stitches and a smooth burnished edge" },
        { name: "Precision-Cut Edge", description: "A carefully cut outline follows simple or custom shapes without a bulky thread rim. Cutting method and edge appearance are confirmed for the chosen leather.", image: asset("border-precision-cut"), alt: "Forest-green feather-shaped leather patch with engraved tan veins and a thin clean precision-cut edge without stitching" },
      ],
    },
  ],
};

export const cta: CTAContent = {
  heading: ["Explore Our Premium", "Leather Patch Designs"],
  description: "Bring rich leather textures, engraved or embossed artwork and distinctive custom branding to jackets, hats, bags and accessories. Create a polished signature with lasting style.",
};

export const details: DetailContent = {
  label: "Leather patch finish options",
  eyebrow: "Material, Texture & Detail",
  title: "Choose Your Leather Patch Finish",
  description: "Balance your artwork with the right material and edge construction. Explore genuine character, a consistent synthetic surface and finishing details that frame your design.",
  cards: [
    { title: "Genuine Leather", description: "Natural grain gives crisp engraved artwork depth and individual character. Rich saddle-brown tones pair well with bold wildlife and heritage-inspired designs.", image: image("genuine-leather", "Saddle-brown genuine leather rounded-square patch with a finely engraved bison portrait, prairie grasses and a burnished edge") },
    { title: "Synthetic Leather", description: "A uniform texture and carefully chosen color create a coordinated branded look. Simple pressed details and restrained printing complement the smooth leather-look face.", image: image("synthetic-leather", "Navy synthetic leather label with a modern debossed bridge and wave motif, a fine gold accent and tonal edge stitching") },
    { title: "Edge Finish", description: "Compare a classic stitched frame with a precise custom outline. The right edge complements the artwork without covering the leather's texture.", image: image("edge-finish", "Two leather mountain-design patches comparing a caramel rectangle with cream saddle stitching and a cognac precision-cut ridge silhouette") },
  ],
  note: "Illustrative material and finish examples. Grain, color, decoration and edge construction are confirmed with your selected leather and artwork.",
};

export const story: StoryContent = {
  heading: ["The Strength and Texture", "of Custom Leather Patches"],
  subheading: "The Craft and Skill Behind Perfectly Crafted Leather Designs",
  paragraphs: [
    "A well-made leather patch starts with its material. Genuine leather brings natural variation and grain; synthetic leather offers a more consistent surface. Each gives your branding a different character, from a warm engraved outdoor badge to a clean modern fashion label.",
    "Craftsmanship connects the artwork to that surface. Engraving creates a precise mark, embossing and debossing add raised or recessed detail, and printing introduces carefully chosen color. Line weight, patch size and material compatibility guide the finish, with a digital mockup to review before production.",
    "The final shape, edge and backing make the design ready for its purpose. Create patches for hats, jackets, jeans, bags and uniforms in a custom run of 10 pieces or more, with construction and care guidance matched to the materials you choose.",
  ],
  image: image("story-collage", "Five original leather patches in tan, cognac, chocolate, navy and forest green featuring pine, compass, motorcycle, architectural and leaf designs"),
};
