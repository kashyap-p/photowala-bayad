import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 10;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body?.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No messages provided." },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMessage) {
      return NextResponse.json(
        { ok: false, error: "No user message found." },
        { status: 400 }
      );
    }

    const response = await generateResponse(lastUserMessage.content);
    return NextResponse.json({ ok: true, response });
  } catch (err) {
    console.error("[chat] error", err);
    return NextResponse.json(
      { ok: false, error: "Chat error" },
      { status: 500 }
    );
  }
}

async function generateResponse(userMessage: string): Promise<string> {
  const msg = userMessage.toLowerCase().trim();

  // 1. Gallery / photo lookup — highest priority
  if (isGalleryIntent(msg)) {
    const galleryLink = await lookupGallery(userMessage);
    if (galleryLink) {
      return galleryLink;
    }
    // no gallery found — ask for identifying info
    if (msg.includes("my photo") || msg.includes("my gallery") || msg.includes("my shoot") || msg.includes("my pictures")) {
      return "I'd love to help you find your photos! Could you share the name or email address you booked with? I'll look up your private gallery link right away.";
    }
  }

  // 2. Services
  if (matchAny(msg, ["service", "what do you", "what kind", "what type", "offer", "do you shoot", "do you do"])) {
    return "We offer four main services:\n\n1. **Wedding Photography** — full-day coverage, pre-wedding shoot, candid + traditional, album + digital gallery\n2. **Portrait Sessions** — studio or on-location, professional lighting, retouched delivery\n3. **Events & Celebrations** — festivals, birthdays, corporate nights, multi-camera setup with 24-hour previews\n4. **Street & Travel** — documentary-style, fine-art prints, custom commissions\n\nWhich one interests you? I can share more details.";
  }

  // 3. Pricing
  if (matchAny(msg, ["price", "cost", "how much", "rate", "charge", "fee", "quote", "package", "afford"])) {
    return "Pricing depends on the event type, duration, location, and deliverables. The best way to get an accurate quote is to fill out the contact form on this page (scroll down to Contact) or call/WhatsApp the studio at +91 63532 27978 — they reply within 24 hours with a tailored package.";
  }

  // 4. Booking
  if (matchAny(msg, ["book", "booking", "schedule", "available", "availability", "reserve", "hire"])) {
    return "To book a shoot, the easiest way is to scroll down to the Contact form on this page and share your date, venue, and what kind of coverage you need. You can also call or WhatsApp +91 63532 27978 directly. The studio is available for 2026 bookings and replies within 24 hours.";
  }

  // 5. Contact
  if (matchAny(msg, ["contact", "reach", "phone", "call", "email", "whatsapp", "instagram", "where", "address", "location", "studio"])) {
    return "Here's how to reach Photowala Bayad:\n\n📞 Phone / WhatsApp: +91 63532 27978\n📧 Email: photowalamodellingstudio@gmail.com\n📱 Instagram: @photowala_bayad\n📍 Studio: Bayad, Sabarkantha, Gujarat 383 340\n🕘 Hours: Mon–Sat, 9 AM – 8 PM\n\nOr just scroll down to the Contact form on this page — it goes straight to the studio.";
  }

  // 6. About / who
  if (matchAny(msg, ["who are", "about", "tell me about", "photowala", "bayad", "background", "experience", "how long", "story"])) {
    return "Photowala Bayad is a photography studio from Bayad, Gujarat, with 9+ years behind the lens. Founded on the belief that ordinary days deserve extraordinary frames, the studio has covered 480+ projects including 120+ weddings across 4 districts of Gujarat. The approach is simple: show up early, shoot honest, edit quietly — no forced smiles, no over-processed skies.";
  }

  // 7. Wedding-specific
  if (matchAny(msg, ["wedding", "bride", "groom", "marriage", "shaadi", "mehndi", "haldi", "sangeet"])) {
    return "Our wedding photography covers the full day — getting ready, the ceremony, and the celebration. Every package includes a pre-wedding shoot, candid + traditional coverage, same-day teasers for social media, and a finished album plus a digital gallery. To check availability for your date, fill out the Contact form below or call +91 63532 27978.";
  }

  // 8. Portrait-specific
  if (matchAny(msg, ["portrait", "headshot", "family photo", "individual", "profile"])) {
    return "Portrait sessions can be in-studio or on-location. We use professional lighting, guide you on wardrobe and posing, and deliver retouched, print-ready files. Sessions typically run 1–2 hours. Book one through the Contact form below or call +91 63532 27978.";
  }

  // 9. Event-specific
  if (matchAny(msg, ["event", "party", "festival", "birthday", "corporate", "celebration", "function"])) {
    return "We cover all kinds of events — festivals, birthdays, corporate gatherings, and family celebrations. Our multi-camera setup captures every guest, and you get 24-hour previews plus a highlight reel. Tell us about your event through the Contact form below.";
  }

  // 10. Gallery/photos (general)
  if (matchAny(msg, ["photo", "gallery", "picture", "image", "portfolio", "work", "shoot", "see your"])) {
    return "You can see our latest work by scrolling up to the Portfolio section — just use the filter buttons to browse by category (Weddings, Portraits, Events, Landscapes, Street). Tap any photo to view it full-screen.\n\nIf you're looking for YOUR specific gallery, just tell me the name or email you booked with and I'll find your private link.";
  }

  // 11. Greetings
  if (matchAny(msg, ["hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon"])) {
    return "Hello! Welcome to Photowala Bayad. I can help you learn about our services, book a shoot, or find your private photo gallery. What can I do for you?";
  }

  // 12. Thanks
  if (matchAny(msg, ["thank", "thanks", "great", "awesome", "perfect", "cool", "nice"])) {
    return "You're welcome! If you have any other questions, feel free to ask. Or scroll down to the Contact form to get in touch with the studio directly. 😊";
  }

  // Fallback
  return "I'm not quite sure about that, but I can help with:\n\n• Our services (weddings, portraits, events, street)\n• Pricing and booking\n• Contact details\n• Finding your private photo gallery\n\nTry asking about one of those, or scroll down to the Contact form to reach the studio directly.";
}

function matchAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function isGalleryIntent(msg: string): boolean {
  return (
    (msg.includes("my photo") ||
      msg.includes("my gallery") ||
      msg.includes("my shoot") ||
      msg.includes("my pictures") ||
      msg.includes("my link") ||
      msg.includes("see my") ||
      msg.includes("find my") ||
      msg.includes("where are my")) &&
    !msg.includes("portfolio") &&
    !msg.includes("your work")
  );
}

async function lookupGallery(userMessage: string): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    // Try email first
    const emailMatch = userMessage.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    if (emailMatch) {
      const email = emailMatch[0].toLowerCase();
      const gallery = await db.gallery.findFirst({
        where: { clientEmail: { contains: email.split("@")[0], mode: "insensitive" } },
        select: { slug: true, title: true, clientName: true, password: true },
      });
      if (gallery) {
        return formatGalleryLink(gallery);
      }
    }

    // Try matching by name
    const galleries = await db.gallery.findMany({
      select: { slug: true, title: true, clientName: true, password: true },
      take: 100,
    });

    const msgLower = userMessage.toLowerCase();
    for (const g of galleries) {
      const nameParts = g.clientName.toLowerCase().split(/\s+/);
      const firstName = nameParts[0];
      // Match if the first name (3+ chars) appears in the message
      if (firstName.length > 2 && msgLower.includes(firstName)) {
        return formatGalleryLink(g);
      }
      // Also try full name
      if (g.clientName.toLowerCase().length > 4 && msgLower.includes(g.clientName.toLowerCase())) {
        return formatGalleryLink(g);
      }
    }

    return null;
  } catch (err) {
    console.error("[chat] gallery lookup error", err);
    return null;
  }
}

function formatGalleryLink(g: {
  slug: string;
  title: string;
  clientName: string;
  password: string | null;
}): string {
  const link = `https://photowala-bayad.vercel.app/g/${g.slug}`;
  const protectedNote = g.password
    ? "\n\n🔒 This gallery is password-protected. Use the password Photowala shared with you to unlock it."
    : "";
  return `I found your gallery!\n\n📸 **${g.title}**\nFor: ${g.clientName}\n\n🔗 ${link}${protectedNote}\n\nEnjoy your photos! Let me know if you need anything else.`;
}
