export type Category = "Weddings" | "Pre-Wedding";

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
  "Pre-Wedding",
];

export const portfolio: PortfolioPhoto[] = [
  {
    id: "p1",
    title: "First Dance",
    category: "Weddings",
    image: "/gallery/photo-01.jpg",
    location: "Bayad, Gujarat",
    year: "2025",
    span: "tall",
  },
  {
    id: "p2",
    title: "Under the Archway",
    category: "Weddings",
    image: "/gallery/photo-02.jpg",
    location: "Sabarkantha",
    year: "2025",
    span: "tall",
  },
  {
    id: "p3",
    title: "Garden Vows",
    category: "Weddings",
    image: "/gallery/photo-03.jpg",
    location: "Modasa",
    year: "2024",
    span: "tall",
  },
  {
    id: "p4",
    title: "Bright & Minimal",
    category: "Pre-Wedding",
    image: "/gallery/photo-04.jpg",
    location: "Himmatnagar",
    year: "2025",
    span: "tall",
  },
  {
    id: "p5",
    title: "Sunlit Field",
    category: "Pre-Wedding",
    image: "/gallery/photo-05.jpg",
    location: "North Gujarat",
    year: "2025",
    span: "wide",
  },
  {
    id: "p6",
    title: "Golden Hour",
    category: "Pre-Wedding",
    image: "/gallery/photo-06.jpg",
    location: "Saurashtra",
    year: "2024",
    span: "wide",
  },
  {
    id: "p7",
    title: "Intimate Moments",
    category: "Weddings",
    image: "/gallery/photo-07.jpg",
    location: "Bayad",
    year: "2025",
    span: "tall",
  },
  {
    id: "p8",
    title: "Embrace",
    category: "Weddings",
    image: "/gallery/photo-08.jpg",
    location: "Sabarkantha",
    year: "2024",
    span: "tall",
  },
  {
    id: "p9",
    title: "Golden Glow",
    category: "Pre-Wedding",
    image: "/gallery/photo-09.jpg",
    location: "Bayad",
    year: "2025",
    span: "tall",
  },
  {
    id: "p10",
    title: "Soft Light",
    category: "Weddings",
    image: "/gallery/photo-10.jpg",
    location: "Modasa",
    year: "2024",
    span: "tall",
  },
  {
    id: "p11",
    title: "Hand in Hand",
    category: "Pre-Wedding",
    image: "/gallery/photo-11.jpg",
    location: "North Gujarat",
    year: "2025",
    span: "wide",
  },
  {
    id: "p12",
    title: "Garden Stroll",
    category: "Weddings",
    image: "/gallery/photo-12.jpg",
    location: "Bayad, Gujarat",
    year: "2025",
    span: "tall",
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
    title: "Pre-Wedding Shoots",
    desc: "Relaxed, romantic sessions at your favourite location — the perfect warm-up before the big day.",
    points: ["Location scouting", "Cinematic edits", "Social-media teasers", "Fine-art prints"],
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
