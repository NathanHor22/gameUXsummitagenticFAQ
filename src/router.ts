import { matchFAQ } from './faq'
import { askClaude } from './claude'

const processing = new Set<string>()

export async function routeMessage(jid: string, text: string): Promise<string | null> {
  if (processing.has(jid)) return null
  processing.add(jid)

  try {
    const faqHit = matchFAQ(text)
    if (faqHit) return faqHit

    return await askClaude(jid, text)
  } finally {
    processing.delete(jid)
  }
}
