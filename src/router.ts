import { classifyIntent } from './classifier'
import { getFAQResponse } from './faq'
import { askGroq } from './llm'

const processing = new Set<string>()

// Messages with multiple questions or significant length need Groq to answer fully.
// FAQ short-circuit only makes sense for simple, single-topic messages.
function isComplexMessage(text: string): boolean {
  const questionCount = (text.match(/\?/g) || []).length
  if (questionCount >= 3) return true
  if (text.length > 280) return true
  if (/\b(and what|what about|besides)\b/i.test(text)) return true
  return false
}

export async function routeMessage(jid: string, text: string): Promise<string | null> {
  if (processing.has(jid)) return null
  processing.add(jid)

  try {
    if (isComplexMessage(text)) return await askGroq(jid, text)

    const category = await classifyIntent(text)
    const faqResponse = getFAQResponse(category)

    if (faqResponse) return faqResponse

    return await askGroq(jid, text)
  } finally {
    processing.delete(jid)
  }
}
