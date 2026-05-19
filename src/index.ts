import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import dotenv from 'dotenv'
import { routeMessage } from './router'
import { sendWithDelay } from './delay'

dotenv.config()

async function connectToWhatsApp() {

  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ['Game UX Summit Bot', 'Chrome', '1.0.0'],
    getMessage: async () => undefined,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode
      const shouldReconnect = code !== DisconnectReason.loggedOut
      console.log(`Connection closed (code ${code}). Reconnecting: ${shouldReconnect}`)
      if (shouldReconnect) connectToWhatsApp()
    } else if (connection === 'open') {
      console.log('✅ WhatsApp connected — Game UX Summit bot is live')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const msg of messages) {
      if (msg.key.fromMe) continue
      if (!msg.message) continue

      const jid = msg.key.remoteJid!

      // Only handle DMs, not group chats
      if (jid.endsWith('@g.us')) continue

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        ''

      if (!text.trim()) continue

      await sock.readMessages([msg.key])

      const response = await routeMessage(jid, text)
      if (!response) return

      await sendWithDelay(sock, jid, text, response)
    }
  })
}

connectToWhatsApp()
