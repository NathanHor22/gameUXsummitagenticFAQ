const TICKET_LINK = 'https://www.eventbrite.com/e/game-ux-summit-2026-tickets-1988970217462?aff=oddtdtcreator'

export const CATEGORIES = [
  'tickets', 'early_bird', 'student_ticket', 'venue', 'hotels',
  'schedule', 'masterclass', 'speakers', 'networking', 'food',
  'organizers', 'contact', 'parking', 'wifi', 'other',
] as const

export type Category = typeof CATEGORIES[number]

const responses: Record<Category, string | null> = {
  tickets: `Alright, here's the rundown on tickets! They're on sale right now 🎟️

• Early Bird — $100 (but this ends May 22, 2026 so grab it while you can!)
• Standard — $150
• Student — $50
• Masterclass — pricing coming soon, separate ticket needed

All summit tickets come with breakfast, lunch, the talks, and networking. Pretty good deal honestly!

You can grab yours here 👉 ${TICKET_LINK}`,

  early_bird: `Good news, the Early Bird deal is still going! 🐦

You can get your ticket for $100 right now, but it ends on May 22, 2026. After that it goes up to $150, so it's worth jumping on it sooner rather than later.

Grab it here 👉 ${TICKET_LINK}`,

  student_ticket: `Yes, there are student tickets available! 🎓

You can get in for just $50. You'll need to verify your student status when you register.

Sign up here 👉 ${TICKET_LINK}`,

  venue: `Great question! The event is being held at 📍

Connexion Conference and Event Centre (CCEC)
Bangsar South, Kuala Lumpur, Malaysia

It's really accessible, good public transport links and there's parking on site too. Would you like some hotel recommendations nearby as well?`,

  hotels: `Here are some hotels close to the venue that we'd suggest 🏨

• VE Hotel and Residence — walking distance, the closest one by far!
• St. Giles Mid Valley — about 4.1 km away
• Kimpton Naluria — around 11 km
• Traders Hotel — around 13 km
• Mandarin Oriental — around 13 km
• Grand Hyatt KL — around 13 km

Honestly, VE Hotel is the easiest option if you want to just walk over to CCEC each day.`,

  schedule: `Here's the schedule for Game UX Summit 2026 📅

• October 12 (Monday) — Summit talks from 9am to 5pm, plus an evening networking mixer
• October 13 (Tuesday) — Summit talks from 9am to 5pm
• October 14 (Wednesday) — Masterclasses from 9am to 5pm (needs a separate ticket)

Three packed days! Are you thinking of coming for all of it?`,

  masterclass: `The Masterclasses are running on October 14 from 9am to 5pm. Do note that they need a separate ticket from the main summit though.

Pricing for masterclasses hasn't been announced just yet. You can drop an email to support@gameuxsummit26.com and they'll update you when it's out!`,

  speakers: `We haven't announced the full speaker lineup just yet but we're working on it! 🎤

Keep an eye on the official website for updates, they'll be posting names as things get confirmed: https://www.gameuxsummit26.com`,

  networking: `Yes there's a networking mixer on the evening of October 12 right after the talks wrap up 🤝

It's included with your summit ticket so no extra cost. Great chance to meet other people in the game UX space!`,

  food: `Good news on this one! Breakfast and lunch are both included with your summit ticket on October 12 and 13 🍽️

Masterclass catering on October 14 is still to be confirmed, but we'll update as we know more.`,

  organizers: `Game UX Summit 2026 is organized by PlayStation Studios Creative together with LEVEL UP KL, which is part of the Malaysia Digital Economy Corporation.

This year is also the 25th anniversary of the summit which makes it a pretty special one! 🎉`,

  contact: `The best way to reach the team is by emailing them directly at 📧

support@gameuxsummit26.com

They're pretty responsive and will be happy to help with anything specific!`,

  parking: `CCEC has parking on site so you're good if you're driving 🚗

If you're taking public transport, the nearest LRT station is Kerinchi (Pantai Dalam) on the Kelana Jaya line, which puts you pretty close to Bangsar South.`,

  wifi: `WiFi will be available on site at CCEC during the event 📶

The specific details will be shared closer to October. If you need to know more in advance, drop the team an email at support@gameuxsummit26.com and they can help you out.`,

  other: null,
}

export function getFAQResponse(category: Category): string | null {
  return responses[category]
}
