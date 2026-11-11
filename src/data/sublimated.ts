import { asset as backingAsset, optionGroups } from "./embroidered";
import type { ApplicationsContent, BenefitsContent, CTAContent, DetailContent, HeroContent, OptionsContent, StoryContent } from "./service-page";

const asset = (name: string) => `/images/sublimated/${name}.webp`;
const image = (name: string, alt: string) => ({ src: asset(name), alt, width: 800, height: 800 });

export const hero: HeroContent = {
  id: "sublimated-heading",
  badge: "Your artwork. Every shade, every detail.",
  heading: ["Custom Sublimated", "Patches"],
  lead: "Print Your Creative Vision, Color by Color",
  paragraphs: [
    "Turn photographic scenes, fine graphics and subtle gradients into full-color fabric patches. Dye-sublimation printing brings detailed artwork to a smooth textile surface with a lightweight, flexible feel.",
    "Create custom sizes and shapes for brand apparel, uniforms, jackets and backpacks. From a crisp logo to a richly detailed image, choose the material, backing and edge that suit your design.",
  ],
  image: image("hero", "Collection of smooth sublimated fabric patches with an alpine lake photograph, coastal emblem, forest cyclist and coral botanical print"),
};

export const applications: ApplicationsContent = {
  label: "Sublimated patch applications",
  eyebrow: "Sublimated Patches for Every Need",
  title: "Photo-Realistic Printed Patches Designed to Capture Your Vision",
  description: "Make room for the details that define your artwork. Full-color dye printing brings photographs, lettering and layered graphics together on a smooth fabric patch.",
  items: [
    { title: "Branding & Logo Patches", description: "Give uniforms, branded bags and promotional apparel a polished signature. Sharp printed lettering, fine graphic details and carefully chosen colors help your identity stay clear and recognizable.", icon: "building", image: image("branding-logo", "NORTH COAST sublimated logo patch with crisp white typography, a wave emblem and royal-blue contour graphics on navy fabric") },
    { title: "Fashion & Lifestyle Patches", description: "Carry an original image into your clothing collection. Detailed landscapes, artistic compositions and natural color gradients give jackets, caps and streetwear a distinctive printed finish.", icon: "shirt", image: image("fashion-lifestyle", "Arched sublimated fashion patch printed with a coastal road, sapphire ocean and a warm sunset over distant headlands") },
    { title: "Sports & Event Patches", description: "Bring a team, tournament or community event together with a custom printed badge. Combine energetic artwork with readable event lettering and colors that express your group identity.", icon: "trophy", image: image("sports-event", "SUMMIT RUN sublimated event patch with a photographic trail runner, emerald forest and cream printed lettering") },
  ],
};

export const benefits: BenefitsContent = {
  title: "Why Choose Our Custom Sublimated Patches?",
  intro: "Sublimation gives detailed artwork a smooth fabric finish. We help balance your image, lettering and patch size so the finished design keeps the character of your original idea.",
  benefits: [
    "Affordable Pricing — a quote matched to your design and quantity",
    "High Print Quality — full-color artwork, fine details and subtle gradients",
    "Free Digital Mockup — review your design before production",
    "Minimum Order: 10 Pieces — start with a small custom run",
    "Fast Shipping — confirm the available options with your quote",
    "Multiple Shapes & Sizes — a format chosen around your artwork",
  ],
  conclusion: "Send your artwork and tell us how you will use your patches. We will help you select a suitable fabric, finishing method and backing, then confirm pricing and timing for your order.",
  image: image("why-choose", "Detailed kingfisher photograph dye-sublimated onto a smooth shield-shaped fabric patch, with cobalt and coral feathers above an emerald stream"),
};

export const options: OptionsContent = {
  eyebrow: "Made for Full-Color Detail",
  title: "Backing, Materials & Border Options",
  description: "Pair your printed artwork with a suitable fabric base, practical attachment and carefully finished edge.",
  centerCards: true,
  groups: [
    {
      id: "backing", label: "Backing Options",
      description: "Choose permanent stitching, heat-applied backing or a removable option. Compatibility depends on the garment fabric, patch size and intended use.",
      // Intentionally shared reverse-side attachment illustrations, not service-specific patch faces.
      items: optionGroups[0].items.map((item, index) => ({ ...item, name: ["Sew-On", "Iron-On", "Peel and Stick", "Velcro / Hook-and-Loop"][index], image: backingAsset(item.image) })),
    },
    {
      id: "materials", label: "Premium Base Materials",
      description: "Two smooth printable fabric options give full-color artwork a lightweight, flexible foundation. Choose the surface that best suits your design and application.",
      items: [
        { name: "Polyester Fabric Base", description: "A smooth, finely woven polyester surface supports detailed dye-sublimation printing and rich color reproduction with a light, flexible feel.", image: asset("polyester-base"), alt: "Fine white polyester fabric swatches for sublimated patches, with a flat blue-ocean and peach-sunset print sample" },
        { name: "Microfiber Fabric", description: "A fine, soft fabric surface offers a smooth canvas for dye-printed artwork. Its lightweight feel and flexibility suit detailed designs on apparel and accessories.", image: asset("microfiber"), alt: "Soft cream microfiber fabric for sublimated patches with a flat detailed emerald fern print and gently folded corner" },
      ],
    },
    {
      id: "borders", label: "Border Options",
      description: "Frame a simple shape with an overlocked stitched edge or follow a custom outline with a precise sealed cut. We will recommend a finish for your artwork and fabric.",
      items: [
        { name: "Merrowed / Stitched Border", description: "A rounded overlocked thread edge frames the printed fabric, giving circles, ovals and other simple shapes a defined finish.", image: asset("merrowed-border"), alt: "Sublimated waterfall photograph on an oval fabric patch with a clearly visible cream overlocked merrowed border" },
        { name: "Laser-Cut Edge", description: "A slim, precisely cut edge follows custom contours without adding a thick stitched rim to the printed design.", image: asset("laser-cut-edge"), alt: "Sublimated alpine-lake photo patch with a thin laser-cut fabric edge following its mountain silhouette" },
      ],
    },
  ],
};

export const cta: CTAContent = {
  heading: ["Explore Our Premium", "Sublimated Patch Designs"],
  description: "Bring vivid photographs, subtle gradients and fine graphic detail to your next custom patch. Share your full-color artwork and let us help choose a fabric, shape and finish for your apparel, brand or team.",
};

export const details: DetailContent = {
  label: "Sublimated patch finishing options",
  eyebrow: "The Right Edge for Your Artwork",
  title: "Finish Your Sublimated Patch",
  description: "A finishing detail changes how your design is framed. Explore a classic stitched border, a precise cut outline or a custom combination suited to your artwork.",
  cards: [
    { title: "Merrowed Border", description: "Frame a detailed printed image with a premium overlocked edge. The raised stitching stays at the perimeter while the picture remains smooth.", image: image("merrowed-border", "Oval sublimated waterfall and forest photo patch framed by a raised cream merrowed thread edge") },
    { title: "Laser-Cut Edge", description: "Keep the outline slim and closely shaped with a clean cut that follows your design, without a bulky stitched border.", image: image("laser-cut-edge", "Custom mountain-shaped sublimated patch with printed blue lake and snowy peaks and a clean laser-cut perimeter") },
    { title: "Your Custom Finish", description: "Compare shape and edge treatments around the same artwork, then choose the combination that complements your design and application.", image: image("custom-finish", "Two sublimated lighthouse sunset patches comparing a stitched rectangular border with a slim laser-cut arched outline") },
  ],
  note: "Illustrative finishing examples. Final detail, shape and edge construction are confirmed with your artwork and selected fabric.",
};

export const story: StoryContent = {
  heading: ["Full-Color Printing", "for Sharp, Vivid Designs"],
  subheading: "The Technique and Precision Behind Perfectly Printed Designs",
  paragraphs: [
    "Dye sublimation uses heat to transfer a printed design into a suitable fabric surface. The result gives photographic details, fine lines and gradual changes in color a smooth textile finish rather than a raised stitched face.",
    "Good preparation makes those details count. Your source artwork, chosen patch dimensions and printable fabric all shape the result. A clear digital mockup helps you review the composition before production, while the backing and edge complete the construction.",
    "From brand uniforms and team apparel to jackets, caps and backpacks, a custom sublimated patch gives your original image a place in everyday life. Start with 10 pieces or more and choose a shape and finish that make the artwork your own.",
  ],
  image: image("story-collage", "Five distinct sublimated fabric patches with coastal, stag, architectural, botanical and night-sky artwork in rich coordinated colors"),
};
