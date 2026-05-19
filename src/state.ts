import Database from 'better-sqlite3'
import path from 'path'
import type Anthropic from '@anthropic-ai/sdk'

const DB_PATH = path.join(process.cwd(), 'data', 'conversations.db')
const MAX_MESSAGES = 8

const db = new Database(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    jid       TEXT    NOT NULL,
    role      TEXT    NOT NULL CHECK(role IN ('user', 'assistant')),
    content   TEXT    NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_messages_jid ON messages(jid);
`)

const selectHistory = db.prepare<[string, number]>(`
  SELECT role, content FROM (
    SELECT id, role, content FROM messages WHERE jid = ? ORDER BY id DESC LIMIT ?
  ) ORDER BY id ASC
`)

const insertMessage = db.prepare<[string, string, string]>(`
  INSERT INTO messages (jid, role, content) VALUES (?, ?, ?)
`)

export async function getHistory(jid: string): Promise<Anthropic.MessageParam[]> {
  const rows = selectHistory.all(jid, MAX_MESSAGES) as { role: string; content: string }[]
  return rows.map(r => ({ role: r.role as 'user' | 'assistant', content: r.content }))
}

export async function appendHistory(jid: string, userMessage: string, assistantMessage: string) {
  const insert = db.transaction(() => {
    insertMessage.run(jid, 'user', userMessage)
    insertMessage.run(jid, 'assistant', assistantMessage)
  })
  insert()
}
