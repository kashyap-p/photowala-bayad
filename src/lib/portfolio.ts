export type Category =
  | "Weddings"
  | "Portraits"
  | "Events"
  | "Landscapes"
  | "Street";

export interface PortfolioPhoto {
  id: string;
  title: string;
  category: Category;
  image: string;
  location: string;
  year: string;
  span: "tall" | "wide" | "regular";
}

export const categories: ("All" | Category)[] = [
  "All",
  "Weddings",
  "Portraits",
  "Events",
  "Landscapes",
  "Street",
];

export const portfolio: PortfolioPhoto[] = [
  {
    id: "p1",
    title: "Vows at Golden Hour",
    category: "Weddings",
    image: "/gallery/wedding-1.png",
    location: "Bayad, Gujarat",
    year: "2024",
    span: "wide",
  },
  {
    id: "p2",
    title: "Mehndi Hands",
    category: "Weddings",
    image: "/gallery/wedding-2.png",
    location: "Sabarkantha",
    year: "2024",
    span: "tall",
  },
  {
    id: "p3",
    title: "Quiet Resolve",
    category: "Portraits",
    image: "/gallery/portrait-1.png",
    location: "Studio",
    year: "2023",
    span: "tall",
  },
  {
    id: "p4",
    title: "In Saree Light",
    category: "Portraits",
    image: "/gallery/portrait-2.png",
    location: "Modasa",
    year: "2024",
    span: "regular",
  },
  {
    id: "p5",
    title: "Festival of Lights",
    category: "Events",
    image: "/gallery/event-1.png",
    location: "Bayad Fair",
    year: "2023",
    span: "wide",
  },
  {
    id: "p6",
    title: "Candlelight Wishes",
    category: "Events",
    image: "/gallery/event-2.png",
    location: "Himmatnagar",
    year: "2024",
    span: "wide",
  },
  {
    id: "p7",
    title: "Fields of Saurashtra",
    category: "Landscapes",
    image: "/gallery/landscape-1.png",
    location: "Gujarat",
    year: "2023",
    span: "wide",
  },
  {
    id: "p8",
    title: "Valley at Dawn",
    category: "Landscapes",
    image: "/gallery/landscape-2.png",
    location: "North Gujarat",
    year: "2024",
    span: "regular",
  },
  {
    id: "p9",
    title: "Town Chronicles",
    category: "Street",
    image: "/gallery/street-1.png",
    location: "Bayad",
    year: "2023",
    span: "tall",
  },
  {
    id: "p10",
    title: "Market Mornings",
    category: "Street",
    image: "/gallery/street-2.png",
    location: "Modasa",
    year: "2024",
    span: "wide",
  },
];

export interface Service {
  num: string;
  title: string;
  desc: string;
  points: string[];
}

export const services: Service[] = [
  {
    num: "01",
    title: "Wedding Photography",
    desc: "Full-day coverage that turns your once-in-a-lifetime moments into a story you'll relive forever.",
    points: ["Pre-wedding shoot", "Candid + traditional", "Same-day teasers", "Album + digital gallery"],
  },
  {
    num: "02",
    title: "Portrait Sessions",
    desc: "Studio or on-location portraits crafted with cinematic light — for individuals, families and creators.",
    points: ["Studio lighting", "Wardrobe guidance", "Retouched delivery", "Print-ready files"],
  },
  {
    num: "03",
    title: "Events & Celebrations",
    desc: "From festivals to birthdays to corporate nights — energetic, documentary-style coverage of every guest.",
    points: ["Multi-camera setup", "Guest candids", "24-hour previews", "Highlight reels"],
  },
  {
    num: "04",
    title: "Street & Travel",
    desc: "Authentic frames of place and people — a quieter, documentary look at life across Gujarat and beyond.",
    points: ["Documentary approach", "Fine-art prints", "Editorial licensing", "Custom commissions"],
  },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Riya & Karan",
    role: "Wedding · Bayad",
    quote:
      "Every frame feels alive. He caught moments we didn't even know happened — laughing grandparents, stolen glances. Our album is a heirloom now.",
    rating: 5,
  },
  {
    name: "Ankit Mehta",
    role: "Portrait Client",
    quote:
      "I hate being photographed, but the session was effortless. The lighting, the mood, the patience — the final portraits look like a magazine cover.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "Event · Himmatnagar",
    quote:
      "We hired Photowala for our annual gathering. Sharp, professional, and somehow everywhere at once. The previews came the next morning. Brilliant.",
    rating: 5,
  },
  {
    name: "Devang Shah",
    role: "Family Portraits",
    quote:
      "Three generations in one frame, and not a single stiff pose. He has a real eye for warmth. Booking again next year without question.",
    rating: 5,
  },
];

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: "480+", label: "Projects shot" },
  { value: "9", label: "Years behind the lens" },
  { value: "120+", label: "Weddings covered" },
  { value: "4", label: "Districts across Gujarat" },
];
