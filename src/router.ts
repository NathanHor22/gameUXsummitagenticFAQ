import { classifyIntent } from './classifier'
import { getFAQResponse } from './faq'
import { askGroq } from './llm'

const processing = new Set<string>()

// Rate limiting: max 10 messages per JID per minute
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000
const MAX_INPUT_LENGTH = 1000

const OOH_FAQ = `Hey! Thanks for reaching out 😊 We're outside office hours right now but here's everything you probably need:

Game UX Summit 2026 — 25th anniversary!
📅 October 12–14, 2026
📍 Connexion Conference & Event Centre (CCEC), Bangsar South, KL

Tickets (on sale now)
• Early Bird — $100 (ends May 22, 2026, grab it!)
• Standard — $150
• Student — $50
• Masterclass (Oct 14) — pricing coming soon, separate ticket

All summit tickets include breakfast, lunch, talks and networking.
👉 https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462?aff=oddtdtcreator

Schedule
• Oct 12 — Talks 9am–5pm + evening networking mixer
• Oct 13 — Talks 9am–5pm
• Oct 14 — Masterclasses 9am–5pm (separate ticket)

Closest hotel: VE Hotel and Residence (walking distance to CCEC)

Speakers: Lineup not announced yet, watch the website for updates.

🌐 https://www.gameuxsummit26.com
📧 support@gameuxsummit26.com

A real human will follow up with you when we're back at 9am! 🙏`

const ERROR_MESSAGE = `Sorry, I'm having a little trouble right now! For anything urgent, drop us an email at support@gameuxsummit26.com and we'll get back to you asap 🙏`

const RATE_LIMIT_MESSAGE = `Whoa, slow down a little! 😅 Give me a moment to catch up, then feel free to send your question again.`

const INJECTION_MESSAGE = `Hey, I'm just here to help with Game UX Summit questions! 😊 What would you like to know about the event?`

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

// Detect common prompt injection and jailbreak attempts.
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|your)\s+instructions/i,
  /forget\s+(everything|all|your|what)/i,
  /you\s+are\s+now\s+(a|an|the)/i,
  /act\s+as\s+(a|an|if)/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /your\s+new\s+(role|instructions|prompt|system)/i,
  /disregard\s+(your|the|all|any)/i,
  /override\s+(your|the|all|any)/i,
  /system\s*:/i,
  /\[system\]/i,
  /new\s+instructions?\s*:/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
]

function isPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text))
}

function isRateLimited(jid: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(jid) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  timestamps.push(now)
  rateLimitMap.set(jid, timestamps)
  return timestamps.length > RATE_LIMIT
}

export async function routeMessage(jid: string, text: string): Promise<string | null> {
  if (processing.has(jid)) return null

  if (isRateLimited(jid)) return RATE_LIMIT_MESSAGE

  const trimmed = text.trim().slice(0, MAX_INPUT_LENGTH)

  if (isPromptInjection(trimmed)) return INJECTION_MESSAGE

  processing.add(jid)

  try {
    // Complex multi-topic messages skip the classifier and go straight to Groq.
    if (isComplexMessage(trimmed)) {
      if (!isOfficeHours()) return OOH_FAQ
      try {
        return await askGroq(jid, trimmed)
      } catch {
        return ERROR_MESSAGE
      }
    }

    const category = await classifyIntent(trimmed)
    const faqResponse = getFAQResponse(category)

    // FAQ answers always work — no office hours check needed.
    if (faqResponse) return faqResponse

    // No FAQ match — needs Groq.
    if (!isOfficeHours()) return OOH_FAQ
    try {
      return await askGroq(jid, trimmed)
    } catch {
      return ERROR_MESSAGE
    }
  } finally {
    processing.delete(jid)
  }
}
