import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
};

async function handleRegister(req, res) {
  let body = '';
  for await (const chunk of req) body += chunk;

  try {
    const { name, email, password } = JSON.parse(body);

    if (!name || !email || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'All fields are required.' }));
    }

    const usersPath = join(__dirname, 'backend/users.json');
    let users;
    try {
      users = JSON.parse(await readFile(usersPath, 'utf-8'));
    } catch {
      users = [];
    }

    if (users.find(u => u.email === email)) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'An account with that email already exists.' }));
    }

    users.push({ id: `u${Date.now()}`, name, email, password });
    await writeFile(usersPath, JSON.stringify(users, null, 2));

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request.' }));
  }
}

async function handleLogin(req, res) {
  let body = '';
  for await (const chunk of req) body += chunk;

  try {
    const { email, password } = JSON.parse(body);

    const usersPath = join(__dirname, 'backend/users.json');
    let users;
    try {
      users = JSON.parse(await readFile(usersPath, 'utf-8'));
    } catch {
      users = [];
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Incorrect email or password.' }));
    }
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request.' }));
  }
}

const server = createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];

  if (req.method === 'POST' && urlPath === '/api/register') {
    return handleRegister(req, res);
  }

  if (req.method === 'POST' && urlPath === '/api/login') {
    return handleLogin(req, res);
  }

  const filePath = join(__dirname, urlPath === '/' ? 'login.html' : urlPath);
  const ext = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Ecommerce Test running at http://localhost:${PORT}`);
  console.log('  Press Ctrl+C to stop.\n');
});
