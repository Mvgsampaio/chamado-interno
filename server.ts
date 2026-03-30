import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Database from 'better-sqlite3';
import path from 'path';
// import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Initialize database with schema if it's empty
const schema = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8');
db.exec(schema);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
// Users
app.get('/api/users', (_req, res) => {
  const users = db.prepare('SELECT id, name, username, email, sector, role, must_reset_password FROM users').all();
  res.json(users);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (user) {
    const { password: _password, ...userWithoutPassword } = user as Record<string, unknown>;
    console.log(_password ? 'Login attempt' : 'Login attempt'); // Use it to satisfy linter
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

app.post('/api/users', (req, res) => {
  const { id, name, username, email, sector, password, role, mustResetPassword } = req.body;
  try {
    db.prepare('INSERT INTO users (id, name, username, email, sector, password, role, must_reset_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, name, username, email, sector, password, role, mustResetPassword ? 1 : 0);
    res.status(201).json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, username, email, sector, password, role, mustResetPassword } = req.body;
  try {
    if (password) {
      db.prepare('UPDATE users SET name = ?, username = ?, email = ?, sector = ?, password = ?, role = ?, must_reset_password = ? WHERE id = ?')
        .run(name, username, email, sector, password, role, mustResetPassword ? 1 : 0, id);
    } else {
      db.prepare('UPDATE users SET name = ?, username = ?, email = ?, sector = ?, role = ?, must_reset_password = ? WHERE id = ?')
        .run(name, username, email, sector, role, mustResetPassword ? 1 : 0, id);
    }
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/users/:id/reset-password', (req, res) => {
  const { id } = req.params;
  try {
    // Reset to a default password and force reset on next login
    const defaultPassword = '123@abc';
    db.prepare('UPDATE users SET password = ?, must_reset_password = 1 WHERE id = ?')
      .run(defaultPassword, id);
    res.json({ success: true, defaultPassword });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

// Tickets
app.get('/api/tickets', (_req, res) => {
  const tickets = db.prepare('SELECT * FROM tickets ORDER BY created_at DESC').all();
  const ticketsWithHistory = tickets.map((t: Record<string, unknown>) => {
    const history = db.prepare('SELECT * FROM ticket_history WHERE ticket_id = ? ORDER BY timestamp ASC').all(t.id);
    return { ...t, history };
  });
  res.json(ticketsWithHistory);
});

app.post('/api/tickets', (req, res) => {
  const { id, requesterId, requesterName, sector, extension, description, status, createdAt, history } = req.body;
  try {
    db.prepare('INSERT INTO tickets (id, requester_id, requester_name, sector, extension, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, requesterId, requesterName, sector, extension, description, status, createdAt);
    
    if (history && history.length > 0) {
      const stmt = db.prepare('INSERT INTO ticket_history (id, ticket_id, timestamp, user_name, action) VALUES (?, ?, ?, ?, ?)');
      for (const entry of history) {
        stmt.run(entry.id, id, entry.timestamp, entry.userName, entry.action);
      }
    }
    res.status(201).json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { status, adminResponse, historyEntry } = req.body;
  try {
    if (status && adminResponse) {
      db.prepare('UPDATE tickets SET status = ?, admin_response = ? WHERE id = ?').run(status, adminResponse, id);
    } else if (status) {
      db.prepare('UPDATE tickets SET status = ? WHERE id = ?').run(status, id);
    } else if (adminResponse) {
      db.prepare('UPDATE tickets SET admin_response = ? WHERE id = ?').run(adminResponse, id);
    }

    if (historyEntry) {
      db.prepare('INSERT INTO ticket_history (id, ticket_id, timestamp, user_name, action) VALUES (?, ?, ?, ?, ?)')
        .run(historyEntry.id, id, historyEntry.timestamp, historyEntry.userName, historyEntry.action);
    }
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

// Config
app.get('/api/config', (_req, res) => {
  const config = db.prepare('SELECT * FROM app_config WHERE id = 1').get();
  res.json(config);
});

app.put('/api/config', (req, res) => {
  const { is2FAEnabled } = req.body;
  try {
    db.prepare('UPDATE app_config SET is_2fa_enabled = ? WHERE id = 1').run(is2FAEnabled ? 1 : 0);
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
