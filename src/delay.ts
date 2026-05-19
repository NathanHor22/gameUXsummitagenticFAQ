import type { WASocket } from '@whiskeysockets/baileys'

const WORDS_PER_MIN_READ = 200
const CHARS_PER_MIN_TYPE = 280
const MIN_DELAY_MS = 4000
const MAX_DELAY_MS = 32000

function withJitter(ms: number): number {
  return ms * (0.8 + Math.random() * 0.4)
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return (words / WORDS_PER_MIN_READ) * 60 * 1000
}

function typingTime(text: string): number {
  return (text.length / CHARS_PER_MIN_TYPE) * 60 * 1000
}

export async function sendWithDelay(
  sock: WASocket,
  jid: string,
  incomingText: string,
  response: string
): Promise<void> {
  const delay = Math.min(
    Math.max(withJitter(readingTime(incomingText) + typingTime(response)), MIN_DELAY_MS),
    MAX_DELAY_MS
  )

  await sock.sendPresenceUpdate('composing', jid)
  await new Promise(resolve => setTimeout(resolve, delay))
  await sock.sendPresenceUpdate('paused', jid)
  await sock.sendMessage(jid, { text: response })
}
