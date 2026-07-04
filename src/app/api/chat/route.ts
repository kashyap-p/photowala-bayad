import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db, isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the virtual assistant for PHOTOWALA BAYAD, a photography studio based in Bayad, Gujarat, India. You are warm, professional, and helpful — like a knowledgeable friend who knows the studio inside out.

ABOUT PHOTOWALA BAYAD:
- A photography studio from Bayad (Sabarkantha district, Gujarat) that has been shooting for 9+ years
- Founded by a passionate photographer who believes ordinary days deserve extraordinary frames
- Has covered 480+ projects including 120+ weddings across 4 districts of Gujarat
- Specialises in: Wedding Photography, Portrait Sessions, Events & Celebrations, Street & Travel
- Approach: show up early, shoot honest, edit quietly — no forced smiles, no over-processed skies

SERVICES OFFERED:
1. Wedding Photography — full-day coverage, pre-wedding shoot, candid + traditional, same-day teasers, album + digital gallery
2. Portrait Sessions — studio or on-location, studio lighting, wardrobe guidance, retouched delivery, print-ready files
3. Events & Celebrations — multi-camera setup, guest candids, 24-hour previews, highlight reels (festivals, birthdays, corporate)
4. Street & Travel — documentary approach, fine-art prints, editorial licensing, custom commissions

HOW TO CONTACT / BOOK:
- Phone / WhatsApp: +91 98xxx xxxxx (call for bookings)
- Email: hello@photowalabayad.com
- Instagram: @photowala_bayad
- Studio: Bayad, Sabarkantha, Gujarat 383 340, India
- Hours: Mon–Sat, 9:00 AM – 8:00 PM
- The website has a contact form (scroll to the Contact section) that goes straight to the studio
- Available for 2026 bookings

GALLERY / PHOTO ACCESS:
- If a client asks about their photos, their gallery link, or wants to view their shoot, tell them:
  "I can help you find your gallery! Please share the name or email you booked with, and I'll look up your private link."
- When a user provides their name or email, it will be looked up automatically and the gallery link will be shared with you to pass along.
- Gallery links look like: https://photowala-bayad.vercel.app/g/[gallery-slug]
- Some galleries are password-protected — remind the client they'll need the password Photowala shared with them.

CONVERSATION GUIDELINES:
- Keep responses concise (2-4 sentences usually). Don't write essays.
- Be conversational and friendly, not robotic.
- If asked about pricing, say: "Pricing depends on the event, duration, and deliverables. The best way to get an accurate quote is to fill out the contact form on this page or call/WhatsApp the studio directly — they reply within 24 hours."
- If asked something you don't know, suggest contacting the studio directly.
- Never make up specific prices, dates, or availability — direct those enquiries to the studio.
- If the user seems interested in booking, encourage them to use the contact form or call.`;

/**
 * Creates a ZAI SDK instance. On Vercel, the /etc/.z-ai-config file isn't
 * available, so we construct the SDK directly from env vars (bypassing the
 * file-based loadConfig). Locally, the file is used automatically.
 */
function createZAI(): ZAI {
  if (process.env.ZAI_BASEURL && process.env.ZAI_APIKEY) {
    // Production: construct directly from env vars
    return new ZAI({
      baseUrl: process.env.ZAI_BASEURL,
      apiKey: process.env.ZAI_APIKEY,
      chatId: process.env.ZAI_CHATID || "",
      token: process.env.ZAI_TOKEN || "",
      userId: process.env.ZAI_USERID || "",
    } as ConstructorParameters<typeof ZAI>[0]);
  }
  // Local dev: ZAI.create() reads from /etc/.z-ai-config
  // This is async, so we return a promise-based wrapper
  throw new Error("ZAI env vars not configured");
}

async function getZAI(): Promise<ZAI> {
  if (process.env.ZAI_BASEURL && process.env.ZAI_APIKEY) {
    return createZAI();
  }
  // Local dev fallback
  return ZAI.create();
}

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

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) {
      return NextResponse.json(
        { ok: false, error: "No user message found." },
        { status: 400 }
      );
    }

    // Check if the user is asking about their gallery/photos
    const galleryContext = await lookupGalleryContext(lastUserMessage.content);

    // Build the system prompt with any gallery context
    const systemContent = galleryContext
      ? `${SYSTEM_PROMPT}\n\n--- GALLERY LOOKUP RESULT ---\nThe user asked about their photos. Based on their message, a gallery was found:\n${galleryContext}\n\nShare this link with the user naturally. If the gallery is password-protected, remind them they need the password.`
      : SYSTEM_PROMPT;

    // Build message array for the SDK
    const sdkMessages = [
      { role: "assistant" as const, content: systemContent },
      ...messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const zai = await getZAI();
    const completion = await zai.chat.completions.create({
      messages: sdkMessages,
      thinking: { type: "disabled" },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { ok: false, error: "No response generated." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, response, galleryFound: !!galleryContext });
  } catch (err) {
    console.error("[chat] error", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `Chat error: ${msg}` },
      { status: 500 }
    );
  }
}

/**
 * If the user mentions their name or email, look up their gallery
 * and return context for the AI to share the link.
 */
async function lookupGalleryContext(userMessage: string): Promise<string | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    // Extract email from the message
    const emailMatch = userMessage.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    if (emailMatch) {
      const email = emailMatch[0].toLowerCase();
      const gallery = await db.gallery.findFirst({
        where: { clientEmail: { contains: email, mode: "insensitive" } },
        select: { slug: true, title: true, clientName: true, password: true },
      });
      if (gallery) {
        const link = `https://photowala-bayad.vercel.app/g/${gallery.slug}`;
        const protected_ = gallery.password ? " (password-protected)" : "";
        return `Gallery: "${gallery.title}" for ${gallery.clientName}\nLink: ${link}${protected_}`;
      }
    }

    // Try matching by name — look for galleries where clientName appears in the message
    const galleries = await db.gallery.findMany({
      select: { slug: true, title: true, clientName: true, password: true },
      take: 50,
    });

    const msgLower = userMessage.toLowerCase();
    for (const g of galleries) {
      const nameParts = g.clientName.toLowerCase().split(/\s+/);
      const firstName = nameParts[0];
      if (firstName.length > 2 && msgLower.includes(firstName)) {
        const link = `https://photowala-bayad.vercel.app/g/${g.slug}`;
        const protected_ = g.password ? " (password-protected)" : "";
        return `Gallery: "${g.title}" for ${g.clientName}\nLink: ${link}${protected_}`;
      }
    }

    return null;
  } catch (err) {
    console.error("[chat] gallery lookup error", err);
    return null;
  }
}
