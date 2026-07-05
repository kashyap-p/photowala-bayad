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

    const response = await generateResponse(lastUserMessage.content, messages);
    return NextResponse.json({ ok: true, response });
  } catch (err) {
    console.error("[chat] error", err);
    return NextResponse.json(
      { ok: false, error: "Chat error" },
      { status: 500 }
    );
  }
}

async function generateResponse(
  userMessage: string,
  history: ChatMessage[]
): Promise<string> {
  const msg = userMessage.toLowerCase().trim();

  // Extract email from the current message (if any)
  const emailMatch = userMessage.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  const providedEmail = emailMatch ? emailMatch[0].toLowerCase().trim() : null;

  // Check if the user has been talking about their photos/gallery at any point
  // in the conversation history (so an email in a follow-up message still
  // triggers the lookup even without restating "my photos").
  const conversationText = history
    .map((m) => m.content.toLowerCase())
    .join(" ");
  const wantsPhotos =
    isGalleryIntent(msg) ||
    /my photo|my gallery|my shoot|my pictures|my link|see my|find my|where are my|view my/.test(
      conversationText
    );

  // 1. If the user provided an email, try to look up their gallery FIRST.
  //    This takes priority over everything else so the client gets their link.
  if (providedEmail) {
    const result = await lookupGalleryByEmail(providedEmail);
    if (result) {
      return result;
    }
    // email provided but no gallery found
    return `I couldn't find a gallery linked to **${providedEmail}**. This could mean:\n\n• The email address doesn't match what we have on file\n• Your gallery hasn't been uploaded yet\n\nCould you double-check the email, or try sharing the name you booked with instead? You can also contact the studio directly at +91 63532 27978 or photowalamodellingstudio@gmail.com.`;
  }

  // 2. Gallery / photo lookup by name — if the user is asking about their photos
  if (wantsPhotos) {
    const galleryLink = await lookupGalleryByName(userMessage);
    if (galleryLink) {
      return galleryLink;
    }
    // no gallery found and no email/name matched — ask for email
    if (isGalleryIntent(msg)) {
      return "I'd love to help you find your photos! 📸\n\nPlease share the **email address** you booked with (e.g. you@email.com) and I'll verify it and send you your private gallery link right away.\n\nAlternatively, you can share the full name you booked under.";
    }
  }

  // 3. Services
  if (matchAny(msg, ["service", "what do you", "what kind", "what type", "offer", "do you shoot", "do you do"])) {
    return "We offer four main services:\n\n1. **Wedding Photography** — full-day coverage, pre-wedding shoot, candid + traditional, album + digital gallery\n2. **Portrait Sessions** — studio or on-location, professional lighting, retouched delivery\n3. **Events & Celebrations** — festivals, birthdays, corporate nights, multi-camera setup with 24-hour previews\n4. **Pre-Wedding Shoots** — relaxed, romantic sessions at your favourite location\n\nWhich one interests you? I can share more details.";
  }

  // 4. Pricing
  if (matchAny(msg, ["price", "cost", "how much", "rate", "charge", "fee", "quote", "package", "afford"])) {
    return "Pricing depends on the event type, duration, location, and deliverables. The best way to get an accurate quote is to fill out the contact form on this page (scroll down to Contact) or call/WhatsApp the studio at +91 63532 27978 — they reply within 24 hours with a tailored package.";
  }

  // 5. Booking
  if (matchAny(msg, ["book", "booking", "schedule", "available", "availability", "reserve", "hire"])) {
    return "To book a shoot, the easiest way is to scroll down to the Contact form on this page and share your date, venue, and what kind of coverage you need. You can also call or WhatsApp +91 63532 27978 directly. The studio is available for 2026 bookings and replies within 24 hours.";
  }

  // 6. Contact
  if (matchAny(msg, ["contact", "reach", "phone", "call", "email", "whatsapp", "instagram", "where", "address", "location", "studio"])) {
    return "Here's how to reach Photowala Bayad:\n\n📞 Phone / WhatsApp: +91 63532 27978\n📧 Email: photowalamodellingstudio@gmail.com\n📱 Instagram: @photowala_bayad\n📍 Studio: Bayad, Sabarkantha, Gujarat 383 340\n🕘 Hours: Mon–Sat, 9 AM – 8 PM\n\nOr just scroll down to the Contact form on this page — it goes straight to the studio.";
  }

  // 7. About / who
  if (matchAny(msg, ["who are", "about", "tell me about", "photowala", "bayad", "background", "experience", "how long", "story"])) {
    return "Photowala Bayad is a photography studio from Bayad, Gujarat, with 9+ years behind the lens. Founded on the belief that ordinary days deserve extraordinary frames, the studio has covered 480+ projects including 120+ weddings across 4 districts of Gujarat. The approach is simple: show up early, shoot honest, edit quietly — no forced smiles, no over-processed skies.";
  }

  // 8. Wedding-specific
  if (matchAny(msg, ["wedding", "bride", "groom", "marriage", "shaadi", "mehndi", "haldi", "sangeet"])) {
    return "Our wedding photography covers the full day — getting ready, the ceremony, and the celebration. Every package includes a pre-wedding shoot, candid + traditional coverage, same-day teasers for social media, and a finished album plus a digital gallery. To check availability for your date, fill out the Contact form below or call +91 63532 27978.";
  }

  // 9. Portrait-specific
  if (matchAny(msg, ["portrait", "headshot", "family photo", "individual", "profile"])) {
    return "Portrait sessions can be in-studio or on-location. We use professional lighting, guide you on wardrobe and posing, and deliver retouched, print-ready files. Sessions typically run 1–2 hours. Book one through the Contact form below or call +91 63532 27978.";
  }

  // 10. Event-specific
  if (matchAny(msg, ["event", "party", "festival", "birthday", "corporate", "celebration", "function"])) {
    return "We cover all kinds of events — festivals, birthdays, corporate gatherings, and family celebrations. Our multi-camera setup captures every guest, and you get 24-hour previews plus a highlight reel. Tell us about your event through the Contact form below.";
  }

  // 11. Gallery/photos (general)
  if (matchAny(msg, ["photo", "gallery", "picture", "image", "portfolio", "work", "shoot", "see your"])) {
    return "You can see our latest work by scrolling up to the Portfolio section — just use the filter buttons to browse by category (Weddings, Pre-Wedding). Tap any photo to view it full-screen.\n\nIf you're looking for YOUR specific gallery, just share the **email address** you booked with and I'll verify it and send you your private link to view and download your photos.";
  }

  // 12. Greetings
  if (matchAny(msg, ["hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon"])) {
    return "Hello! Welcome to Photowala Bayad. I can help you learn about our services, book a shoot, or find your private photo gallery. What can I do for you?";
  }

  // 13. Thanks
  if (matchAny(msg, ["thank", "thanks", "great", "awesome", "perfect", "cool", "nice"])) {
    return "You're welcome! If you have any other questions, feel free to ask. Or scroll down to the Contact form to get in touch with the studio directly. 😊";
  }

  // Fallback
  return "I'm not quite sure about that, but I can help with:\n\n• Our services (weddings, portraits, events, pre-wedding)\n• Pricing and booking\n• Contact details\n• Finding your private photo gallery (just share your email!)\n\nTry asking about one of those, or scroll down to the Contact form to reach the studio directly.";
}

function matchAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function isGalleryIntent(msg: string): boolean {
  return (
    msg.includes("my photo") ||
    msg.includes("my gallery") ||
    msg.includes("my shoot") ||
    msg.includes("my pictures") ||
    msg.includes("my link") ||
    msg.includes("see my") ||
    msg.includes("find my") ||
    msg.includes("where are my") ||
    msg.includes("view my")
  );
}

/**
 * Look up a gallery by the client's email address.
 * Fetches all galleries and compares emails case-insensitively in JS,
 * which is more reliable than Prisma's `contains` + `mode: insensitive`
 * on SQLite/libSQL (which can behave inconsistently).
 */
async function lookupGalleryByEmail(email: string): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    const galleries = await db.gallery.findMany({
      select: {
        slug: true,
        title: true,
        clientName: true,
        clientEmail: true,
        password: true,
        expiresAt: true,
      },
      take: 200,
    });

    // Normalize the provided email for comparison
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Exact email match (case-insensitive)
    for (const g of galleries) {
      const storedEmail = (g.clientEmail || "").trim().toLowerCase();
      if (storedEmail && storedEmail === normalizedEmail) {
        return formatGalleryLink(g, "email");
      }
    }

    // 2. Partial match — the local part (before @) matches
    //    (handles cases where the domain differs slightly)
    const localPart = normalizedEmail.split("@")[0];
    if (localPart && localPart.length >= 3) {
      for (const g of galleries) {
        const storedLocal = (g.clientEmail || "").split("@")[0].trim().toLowerCase();
        if (storedLocal && storedLocal === localPart) {
          return formatGalleryLink(g, "email");
        }
      }
    }

    return null;
  } catch (err) {
    console.error("[chat] gallery email lookup error", err);
    return null;
  }
}

/**
 * Look up a gallery by the client's name (extracted from the message).
 */
async function lookupGalleryByName(userMessage: string): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    const galleries = await db.gallery.findMany({
      select: {
        slug: true,
        title: true,
        clientName: true,
        password: true,
        expiresAt: true,
      },
      take: 200,
    });

    const msgLower = userMessage.toLowerCase();
    for (const g of galleries) {
      const nameParts = g.clientName.toLowerCase().split(/\s+/);
      const firstName = nameParts[0];
      // Match if the first name (3+ chars) appears in the message
      if (firstName.length > 2 && msgLower.includes(firstName)) {
        return formatGalleryLink(g, "name");
      }
      // Also try full name
      if (
        g.clientName.toLowerCase().length > 4 &&
        msgLower.includes(g.clientName.toLowerCase())
      ) {
        return formatGalleryLink(g, "name");
      }
    }

    return null;
  } catch (err) {
    console.error("[chat] gallery name lookup error", err);
    return null;
  }
}

function formatGalleryLink(
  g: {
    slug: string;
    title: string;
    clientName: string;
    password: string | null;
    expiresAt: Date | null;
  },
  verifiedBy: "email" | "name"
): string {
  // Check if the gallery has expired
  if (g.expiresAt && new Date(g.expiresAt) < new Date()) {
    const expiredDate = new Date(g.expiresAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const verifiedText =
      verifiedBy === "email"
        ? "✅ Email verified!"
        : "I found a gallery matching your name:";
    return `${verifiedText} However, your gallery "${g.title}" expired on ${expiredDate}.

Please contact the studio to have access restored:
📞 +91 63532 27978
📧 photowalamodellingstudio@gmail.com

The studio can extend the expiry and resend your link right away.`;
  }

  const link = `https://photowala-bayad.vercel.app/g/${g.slug}`;
  const verifiedText =
    verifiedBy === "email"
      ? "✅ Email verified! Here's your private gallery:"
      : "I found a gallery matching your name:";
  const protectedNote = g.password
    ? "\n\n🔒 This gallery is password-protected. Use the password Photowala shared with you to unlock it. If you've forgotten it, contact the studio at +91 63532 27978."
    : "";
  return `${verifiedText}\n\n📸 **${g.title}**\nFor: ${g.clientName}\n\n🔗 ${link}${protectedNote}\n\nYou can view and download your photos from this link. Enjoy! 📷`;
}
