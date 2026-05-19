import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import dotenv from 'dotenv'
import { routeMessage } from './router'
import { sendWithDelay } from './delay'

dotenv.config()

let reconnectDelay = 3000

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    browser: ['Game UX Summit Bot', 'Chrome', '1.0.0'],
    getMessage: async () => undefined,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    retryRequestDelayMs: 2000,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\nScan this QR code with WhatsApp on your phone:\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      reconnectDelay = 3000
      console.log('✅ WhatsApp connected — Game UX Summit bot is live')
    }

    if (connection === 'close') {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode

      if (code === DisconnectReason.loggedOut) {
        console.log('❌ Logged out — delete the auth_info_baileys folder and restart to re-link.')
        process.exit(1)
      }

      // Code 440 = conflict/replaced — another session took over, wait longer before retrying
      if (code === 440) {
        reconnectDelay = Math.min(reconnectDelay * 2, 60000)
        console.log(`⚠️  Session conflict detected. Retrying in ${reconnectDelay / 1000}s...`)
      } else {
        console.log(`Connection closed (code ${code}). Reconnecting in ${reconnectDelay / 1000}s...`)
      }

      setTimeout(connectToWhatsApp, reconnectDelay)
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return

    for (const msg of messages) {
      if (msg.key.fromMe) continue
      if (!msg.message) continue

      const jid = msg.key.remoteJid!

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
