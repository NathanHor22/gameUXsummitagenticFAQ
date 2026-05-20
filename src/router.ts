import { classifyIntent } from './classifier'
import { getFAQResponse } from './faq'
import { askGroq } from './llm'

const processing = new Set<string>()

const OOH_FAQ = `Hey! Thanks for reaching out 😊 We're outside office hours right now but here's everything you probably need:

*Game UX Summit 2026* — 25th anniversary!
📅 *October 12–14, 2026*
📍 *Connexion Conference & Event Centre (CCEC)*, Bangsar South, KL

*Tickets (on sale now)*
• Early Bird — *$100* (ends May 22, 2026, grab it!)
• Standard — *$150*
• Student — *$50*
• Masterclass (Oct 14) — pricing coming soon, separate ticket

All summit tickets include breakfast, lunch, talks and networking.
👉 https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462?aff=oddtdtcreator

*Schedule*
• Oct 12 — Talks 9am–5pm + evening networking mixer
• Oct 13 — Talks 9am–5pm
• Oct 14 — Masterclasses 9am–5pm (separate ticket)

*Closest hotel:* VE Hotel and Residence (walking distance to CCEC)

*Speakers:* Lineup not announced yet, watch the website for updates.

🌐 https://www.gameuxsummit26.com
📧 support@gameuxsummit26.com

A real human will follow up with you when we're back at 9am! 🙏`

const ERROR_MESSAGE = `Sorry, I'm having a little trouble right now! For anything urgent, drop us an email at *support@gameuxsummit26.com* and we'll get back to you asap 🙏`

// KL is UTC+8. Office hours: 9am–6pm every day.
function isOfficeHours(): boolean {
  const klHour = (new Date().getUTCHours() + 8) % 24
  return klHour >= 9 && klHour < 18
}

// Route to Groq when the message spans multiple topics.
function isComplexMessage(text: string): boolean {
  const questionCount = (text.match(/\?/g) || []).length
  if (questionCount >= 2) return true
  if (/\b(and what|and when|and where|and how|and who|what about|besides|also|one more|another question)\b/i.test(text)) return true
  return false
}

export async function routeMessage(jid: string, text: string): Promise<string | null> {
  if (processing.has(jid)) return null
  processing.add(jid)

  try {
    // Complex multi-topic messages skip the classifier and go straight to Groq.
    if (isComplexMessage(text)) {
      if (!isOfficeHours()) return OOH_FAQ
      try {
        return await askGroq(jid, text)
      } catch {
        return ERROR_MESSAGE
      }
    }

    const category = await classifyIntent(text)
    const faqResponse = getFAQResponse(category)

    // FAQ answers always work — no office hours check needed.
    if (faqResponse) return faqResponse

    // No FAQ match — needs Groq.
    if (!isOfficeHours()) return OOH_FAQ
    try {
      return await askGroq(jid, text)
    } catch {
      return ERROR_MESSAGE
    }
  } finally {
    processing.delete(jid)
  }
}
