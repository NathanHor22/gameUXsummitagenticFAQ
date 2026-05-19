interface FAQEntry {
  keywords: string[]
  response: string
}

const faqs: FAQEntry[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening', 'greetings', 'sup', 'yo'],
    response: `Hi there! 👋 Welcome to Game UX Summit 2026 support. I can help with info about the event — venue, tickets, schedule, hotels, and more. What would you like to know?`,
  },
  {
    keywords: ['venue', 'location', 'where', 'address', 'place', 'held', 'happening', 'directions'],
    response: `📍 *Venue: Connexion Conference & Event Centre (CCEC)*
Bangsar South, Kuala Lumpur, Malaysia

It's well-connected by public transport and has parking on-site. Need help with nearby hotels too?`,
  },
  {
    keywords: ['hotel', 'accommodation', 'stay', 'sleep', 'nearby', 'place to stay', 'hostel', 'airbnb', 'lodging'],
    response: `🏨 *Recommended hotels near CCEC:*

• *VE Hotel & Residence* — Walking distance ($$-$$$) ⭐ Closest!
• *St. Giles Mid Valley* — 4.1 km ($$-$$$)
• *Kimpton Naluria* — 11 km ($$$)
• *Traders Hotel* — 13 km ($$-$$$)
• *Mandarin Oriental* — 13 km ($$$)
• *Grand Hyatt KL* — 13 km ($$$)

VE Hotel is the most convenient — just a short walk to the venue!`,
  },
  {
    keywords: ['date', 'when', 'schedule', 'agenda', 'programme', 'program', 'day', 'october', 'timetable'],
    response: `📅 *Game UX Summit 2026 Schedule:*

*Oct 12 (Mon)* — Summit talks, 9 AM–5 PM + Evening networking mixer
*Oct 13 (Tue)* — Summit talks, 9 AM–5 PM
*Oct 14 (Wed)* — Masterclasses, 9 AM–5 PM _(separate ticket)_

Talks run both summit days and cover the full spectrum of game UX!`,
  },
  {
    keywords: ['ticket', 'price', 'cost', 'how much', 'fee', 'register', 'registration', 'buy', 'purchase', 'sign up'],
    response: `🎟️ *Ticket Prices:*

• *Early Bird Summit* — $100 _(ends May 22, 2026!)_
• *Standard Summit* — $150
• *Student* — $50
• *Masterclass* — Pricing coming soon

All summit tickets include talks, panels, *breakfast, lunch*, and networking.

👉 Register: https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462`,
  },
  {
    keywords: ['early bird', 'discount', 'promo', 'sale', 'cheap'],
    response: `🐦 *Early Bird is $100* and ends *May 22, 2026* — after that it's $150.

Don't miss it: https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462`,
  },
  {
    keywords: ['student', 'student ticket', 'university', 'college', 'study'],
    response: `🎓 *Student tickets are just $50!*

Register here and verify your student status: https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462`,
  },
  {
    keywords: ['masterclass', 'workshop', 'hands-on'],
    response: `🎓 *Masterclasses* are on *October 14* (9 AM–5 PM) and need a *separate ticket* from the summit. Pricing is coming soon!

Check back on the site or email support@gameuxsummit26.com for updates.`,
  },
  {
    keywords: ['speaker', 'speakers', 'celia', 'hodent', 'presenter', 'keynote', 'talk', 'session'],
    response: `🎤 *Summit Chair: Celia Hodent* — a globally recognised leader in game UX psychology.

More speakers are being announced! Follow the site for updates: https://www.gameuxsummit26.com`,
  },
  {
    keywords: ['networking', 'mixer', 'social', 'meet', 'connect', 'after party'],
    response: `🤝 There's an *evening networking mixer on October 12* after the summit talks — a great chance to meet fellow game UX professionals. Included with your summit ticket!`,
  },
  {
    keywords: ['food', 'meal', 'breakfast', 'lunch', 'catering', 'eat', 'drink', 'snack'],
    response: `🍽️ *Breakfast and lunch are included* with all summit tickets (Oct 12–13). Masterclass catering details are TBC.`,
  },
  {
    keywords: ['organiser', 'organizer', 'who is running', 'organized by', 'behind'],
    response: `Game UX Summit 2026 is organized by *PlayStation Studios Creative* and *LEVEL UP KL* (Malaysia Digital Economy Corporation). This is the *25th anniversary* of the summit! 🎉`,
  },
  {
    keywords: ['25', '25th', 'anniversary', 'milestone'],
    response: `🎉 *25th Anniversary!* Game UX Summit 2026 marks a huge milestone for the global game UX community. A very special edition not to be missed!`,
  },
  {
    keywords: ['contact', 'email', 'support', 'help', 'question', 'reach'],
    response: `📧 For any questions, email the organizers at *support@gameuxsummit26.com* — they're very responsive!`,
  },
  {
    keywords: ['code of conduct', 'conduct', 'safety', 'safe', 'behaviour', 'behavior', 'harassment'],
    response: `The summit has a *Code of Conduct* to ensure a safe and welcoming environment for everyone. You can find it on the official website: https://www.gameuxsummit26.com`,
  },
  {
    keywords: ['website', 'site', 'more info', 'more information', 'link'],
    response: `Here's the official Game UX Summit 2026 website for all the details: https://www.gameuxsummit26.com 🌐`,
  },
]

export function matchFAQ(text: string): string | null {
  const lower = text.toLowerCase()
  for (const faq of faqs) {
    if (faq.keywords.some(kw => lower.includes(kw))) {
      return faq.response
    }
  }
  return null
}
