interface FAQEntry {
  keywords: string[]
  response: string
}

const TICKET_LINK = 'https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462?aff=oddtdtcreator'

function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

const faqs: FAQEntry[] = [
  {
    keywords: ['venue', 'location', 'where', 'address', 'place', 'directions', 'ccec', 'connexion'],
    response: `📍 *Venue: Connexion Conference & Event Centre (CCEC)*
Bangsar South, Kuala Lumpur, Malaysia

Well-connected by public transport and has on-site parking. Need nearby hotel suggestions too?`,
  },
  {
    keywords: ['hotel', 'accommodation', 'stay', 'sleep', 'nearby', 'hostel', 'airbnb', 'lodging'],
    response: `🏨 *Recommended hotels near CCEC:*

• *VE Hotel & Residence* — Walking distance ⭐ Closest!
• *St. Giles Mid Valley* — 4.1 km
• *Kimpton Naluria* — 11 km
• *Traders Hotel* — 13 km
• *Mandarin Oriental* — 13 km
• *Grand Hyatt KL* — 13 km

VE Hotel is the most convenient — just a short walk to CCEC!`,
  },
  {
    keywords: ['date', 'when', 'schedule', 'agenda', 'programme', 'program', 'october', 'timetable', 'days'],
    response: `📅 *Game UX Summit 2026 — October 12 to 14, 2026*

*Oct 12 (Mon)* — Summit talks, 9 AM–5 PM + Evening networking mixer
*Oct 13 (Tue)* — Summit talks, 9 AM–5 PM
*Oct 14 (Wed)* — Masterclasses, 9 AM–5 PM _(separate ticket required)_`,
  },
  {
    keywords: ['ticket', 'price', 'cost', 'fee', 'buy', 'purchase', 'register', 'registration', 'sign up', 'book', 'get ticket', 'how to get', 'eventbrite', 'get in', 'attend'],
    response: `🎟️ *Tickets are on sale now!*

• *Early Bird Summit* — $100 _(ends May 22, 2026 — grab it fast!)_
• *Standard Summit* — $150
• *Student* — $50
• *Masterclass* — Pricing coming soon

All summit tickets include talks, panels, *breakfast & lunch*, and networking.

👉 Buy here: ${TICKET_LINK}`,
  },
  {
    keywords: ['early bird', 'discount', 'promo', 'cheap', 'cheapest', 'save', 'offer'],
    response: `🐦 *Early Bird tickets are $100* — on sale *right now* until *May 22, 2026!*

After that the price goes up to $150, so don't wait!
👉 ${TICKET_LINK}`,
  },
  {
    keywords: ['student', 'university', 'college'],
    response: `🎓 *Student tickets are just $50!* Register and verify your student status here:
👉 ${TICKET_LINK}`,
  },
  {
    keywords: ['masterclass', 'workshop'],
    response: `🎓 *Masterclasses* run on *October 14* (9 AM–5 PM) and need a separate ticket. Pricing coming soon — email support@gameuxsummit26.com for updates.`,
  },
  {
    keywords: ['speaker', 'speakers', 'presenter', 'keynote', 'lineup', 'who is speaking', 'presenting', 'celia', 'hodent'],
    response: `🎤 Speaker announcements are *coming soon!* The full lineup hasn't been revealed yet — keep an eye on the official website for updates: https://www.gameuxsummit26.com`,
  },
  {
    keywords: ['networking', 'mixer', 'social', 'after party'],
    response: `🤝 There's an *evening networking mixer on October 12* after the talks — included with your summit ticket!`,
  },
  {
    keywords: ['food', 'meal', 'breakfast', 'lunch', 'catering', 'eat'],
    response: `🍽️ *Breakfast and lunch are included* with all summit tickets on Oct 12 & 13. Masterclass catering TBC.`,
  },
  {
    keywords: ['organiser', 'organizer', 'organized by', 'who runs'],
    response: `Game UX Summit 2026 is organized by *PlayStation Studios Creative* and *LEVEL UP KL* (Malaysia Digital Economy Corporation). This is the *25th anniversary!* 🎉`,
  },
  {
    keywords: ['contact', 'email', 'support', 'reach'],
    response: `📧 Reach the organizers at *support@gameuxsummit26.com* — they're happy to help!`,
  },
  {
    keywords: ['website', 'site', 'more info'],
    response: `🌐 Official website: https://www.gameuxsummit26.com`,
  },
  {
    keywords: ['parking', 'park', 'drive', 'car'],
    response: `🚗 CCEC has on-site parking available. Bangsar South is also accessible by LRT — nearest station is *Kerinchi (Pantai Dalam)* on the Kelana Jaya line.`,
  },
  {
    keywords: ['wifi', 'internet'],
    response: `📶 WiFi details will be provided on-site at CCEC. For more info email support@gameuxsummit26.com.`,
  },
]

export function matchFAQ(text: string): string | null {
  for (const faq of faqs) {
    if (faq.keywords.some(kw => matchesKeyword(text, kw))) {
      return faq.response
    }
  }
  return null
}
