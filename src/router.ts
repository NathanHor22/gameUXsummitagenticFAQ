import { classifyIntent } from './classifier'
import { getFAQResponse } from './faq'
import { askClaude } from './claude'

const processing = new Set<string>()

export async function routeMessage(jid: string, text: string): Promise<string | null> {
  if (processing.has(jid)) return null
  processing.add(jid)

  try {
    const category = await classifyIntent(text)
    const faqResponse = getFAQResponse(category)

    if (faqResponse) return faqResponse

    // category === 'other' — let the full LLM handle it
    return await askClaude(jid, text)
  } finally {
    processing.delete(jid)
  }
}
