import Groq from 'groq-sdk'
import { CATEGORIES, type Category } from './faq'

let client: Groq | null = null
function getClient(): Groq {
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return client
}

const SYSTEM = `You are an intent classifier for a Game UX Summit 2026 WhatsApp support bot.
Classify the user message into exactly one category. Reply with the category name only — no punctuation, no explanation.

Categories:
- tickets       → buying, price, cost, how to get a ticket, registration, Eventbrite
- early_bird    → early bird deal, discount, promo
- student_ticket→ student price or student registration
- venue         → location, address, CCEC, how to get there
- hotels        → accommodation, nearby hotels, where to stay
- schedule      → dates, agenda, programme, what time, October 12-14
- masterclass   → workshop, masterclass, October 14
- speakers      → who is speaking, lineup, presenters, keynote
- networking    → mixer, social event, networking session
- food          → meals, lunch, breakfast, catering
- organizers    → who runs the event, PlayStation, LEVEL UP KL
- contact       → email, support, how to reach the team
- parking       → car, parking, driving, LRT
- wifi          → internet, wifi at the venue
- other         → anything not about Game UX Summit 2026`

export async function classifyIntent(text: string): Promise<Category> {
  const response = await getClient().chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 10,
    temperature: 0,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: text },
    ],
  })

  const raw = response.choices[0]?.message?.content?.trim().toLowerCase() ?? 'other'
  return (CATEGORIES as readonly string[]).includes(raw) ? (raw as Category) : 'other'
}
