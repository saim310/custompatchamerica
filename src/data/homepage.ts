export interface NavLink {
  label: string;
  href: string;
}

export interface IconItem {
  icon: string;
  title: string;
}

export interface IconTextItem extends IconItem {
  text: string;
}

export interface Category {
  href?: string;
  icon: string;
  name: string;
  image: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
}

export interface Review {
  title?: string;
  quote: string;
  name: string;
  role: string;
}

export interface FooterGroup {
  heading: string;
  links: string[];
}

export const navLinks: NavLink[] = [
  { label: "Products⌄", href: "#categories" },
  { label: "How It Works", href: "#process" },
  { label: "About", href: "#story" },
  { label: "Resources⌄", href: "#footer" },
];

export const heroPerks: IconItem[] = [
  { icon: "⊙", title: "Free Digital Mockup" },
  { icon: "◷", title: "No Minimum Order" },
  { icon: "⊕", title: "Fast Turnaround" },
  { icon: "⊙", title: "No Upfront Fee" },
  { icon: "◴", title: "Top Turnaround" },
  { icon: "✧", title: "Premium Quality" },
];

export const benefits: IconTextItem[] = [
  { icon: "?", title: "Premium Materials", text: "Built to last" },
  { icon: "?", title: "Fast Turnaround", text: "On-time delivery" },
  { icon: "?", title: "No Minimum Order", text: "Any quantity" },
  { icon: "?", title: "Free Design Support", text: "Bring your idea to life" },
  { icon: "?", title: "U.S. Based Support", text: "Real people, real help" },
];

export const categories: Category[] = [
  { icon: "??", name: "Embroidered", href: "/embroidered-patches", image: "/images/categories/EMBROIDERY.png" },
  { icon: "???", name: "PVC", href: "/pvc-patches", image: "/images/categories/PVC.png" },
  { icon: "?", name: "Leather", href: "/leather-patches", image: "/images/categories/LEATHER.png" },
  { icon: "???", name: "Chenille", href: "/chenille-patches", image: "/images/categories/CHENILLE.png" },
  { icon: "?", name: "Woven", href: "/woven-patches", image: "/images/categories/WOVEN.png" },
  { icon: "??", name: "Sublimated", href: "/sublimated-patches", image: "/images/categories/SUBLIMATED.png" },
  { icon: "?", name: "Iron-On", href: "/embroidered-patches", image: "/images/categories/IRON%20ON.png" },
  { icon: "????", name: "Velcro", href: "/embroidered-patches", image: "/images/categories/VELCRO.png" },
];

export const stats: Stat[] = [
  { icon: "♧", value: "10,000+", label: "Happy Customers" },
  { icon: "☆", value: "4.9/5", label: "Average Rating" },
  { icon: "⚑", value: "100%", label: "U.S. Focused" },
];

export const steps: IconTextItem[] = [
  { icon: "?", title: "Share Your Idea", text: "Tell us your design, size, quantity and any special requirements." },
  { icon: "?", title: "Approve Mockup", text: "We create a free digital mockup for your review." },
  { icon: "?", title: "We Produce", text: "Our experts bring your patches to life." },
  { icon: "?", title: "Delivered to You", text: "Fast, reliable shipping across the USA." },
];

export const reviews: Review[] = [
  { title: "Excellent Quality", quote: "Absolutely loved how our custom patches turned out! The stitching is clean, colors are vibrant, and every detail looks exactly how we wanted. Definitely ordering again!", name: "Jason M.", role: "Business Owner" },
  { title: "Smooth Experience", quote: "From sharing our design to receiving the final patches, everything was super easy. The team was responsive, delivery was quick, and the quality exceeded our expectations!", name: "Sarah L.", role: "Team Manager" },
  { quote: "Amazing quality and super fast service. Our team patches turned out perfect!", name: "Jason M.", role: "Business Owner" },
  { quote: "The design support was fantastic. Highly recommend!", name: "Sarah L.", role: "Team Manager" },
  { quote: "Professional, responsive, and the patches look even better in person.", name: "Mike R.", role: "Brand Founder" },
];

export const quotePerks = ["Free digital mockup", "No minimum order", "Fast turnaround", "U.S. based support"];

export const patchTypes = ["Embroidered", "PVC", "Woven", "Leather"];

export const quantities = ["50-100", "100-500", "500+"];

export const footerGroups: FooterGroup[] = [
  { heading: "Products", links: ["Embroidered Patches", "PVC Patches", "Woven Patches", "Leather Patches", "Chenille Patches", "Sublimated Patches", "All Products"] },
  { heading: "Company", links: ["About Us", "Our Work", "Reviews", "Blog", "Contact"] },
  { heading: "Resources", links: ["Design Guide", "Patch Backings", "Artwork Requirements", "Shipping Information", "FAQs"] },
];
