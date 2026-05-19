const TICKET_LINK = 'https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462?aff=oddtdtcreator'

export const CATEGORIES = [
  'tickets', 'early_bird', 'student_ticket', 'venue', 'hotels',
  'schedule', 'masterclass', 'speakers', 'networking', 'food',
  'organizers', 'contact', 'parking', 'wifi', 'other',
] as const

export type Category = typeof CATEGORIES[number]

const responses: Record<Category, string | null> = {
  tickets: `🎟️ *Tickets are on sale now!*

• *Early Bird Summit* — $100 _(ends May 22, 2026 — grab it fast!)_
• *Standard Summit* — $150
• *Student* — $50
• *Masterclass* — Pricing coming soon

All summit tickets include talks, panels, *breakfast & lunch*, and networking.

👉 Buy here: ${TICKET_LINK}`,

  early_bird: `🐦 *Early Bird tickets are $100* — on sale *right now* until *May 22, 2026!*

After that the price goes up to $150, so don't wait!
👉 ${TICKET_LINK}`,

  student_ticket: `🎓 *Student tickets are just $50!* Register and verify your student status here:
👉 ${TICKET_LINK}`,

  venue: `📍 *Venue: Connexion Conference & Event Centre (CCEC)*
Bangsar South, Kuala Lumpur, Malaysia

Well-connected by public transport and has on-site parking. Need nearby hotel suggestions too?`,

  hotels: `🏨 *Recommended hotels near CCEC:*

• *VE Hotel & Residence* — Walking distance ⭐ Closest!
• *St. Giles Mid Valley* — 4.1 km
• *Kimpton Naluria* — 11 km
• *Traders Hotel* — 13 km
• *Mandarin Oriental* — 13 km
• *Grand Hyatt KL* — 13 km

VE Hotel is the most convenient — just a short walk to CCEC!`,

  schedule: `📅 *Game UX Summit 2026 — October 12 to 14, 2026*

*Oct 12 (Mon)* — Summit talks, 9 AM–5 PM + Evening networking mixer
*Oct 13 (Tue)* — Summit talks, 9 AM–5 PM
*Oct 14 (Wed)* — Masterclasses, 9 AM–5 PM _(separate ticket required)_`,

  masterclass: `🎓 *Masterclasses* run on *October 14* (9 AM–5 PM) and need a separate ticket. Pricing coming soon — email support@gameuxsummit26.com for updates.`,

  speakers: `🎤 Speaker announcements are *coming soon!* The full lineup hasn't been revealed yet — keep an eye on the official website: https://www.gameuxsummit26.com`,

  networking: `🤝 There's an *evening networking mixer on October 12* after the talks — included with your summit ticket!`,

  food: `🍽️ *Breakfast and lunch are included* with all summit tickets on Oct 12 & 13. Masterclass catering TBC.`,

  organizers: `Game UX Summit 2026 is organized by *PlayStation Studios Creative* and *LEVEL UP KL* (Malaysia Digital Economy Corporation). This is the *25th anniversary!* 🎉`,

  contact: `📧 Reach the organizers at *support@gameuxsummit26.com* — they're happy to help!`,

  parking: `🚗 CCEC has on-site parking available. Bangsar South is also accessible by LRT — nearest station is *Kerinchi (Pantai Dalam)* on the Kelana Jaya line.`,

  wifi: `📶 WiFi details will be provided on-site at CCEC. Email support@gameuxsummit26.com for more info.`,

  other: null, // signals router to use full LLM
}

export function getFAQResponse(category: Category): string | null {
  return responses[category]
}
