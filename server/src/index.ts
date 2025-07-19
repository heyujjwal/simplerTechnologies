import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve static JSON data with better error handling
app.get('/api/users', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'product.json');
  
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const users = JSON.parse(data);

    if (!Array.isArray(users)) {
      throw new Error('Data is not an array');
    }

    const validatedUsers = users.map(user => {
      if (!user.id || !user.name || !user.email || !user.mobile || !user.status) {
        throw new Error('Missing required fields');
      }
      return {
        id: Number(user.id),
        name: String(user.name),
        email: String(user.email),
        mobile: String(user.mobile),
        status: String(user.status).toLowerCase() as 'active' | 'inactive',
        avatar: user.avatar || `https://i.pravatar.cc/150?img=${user.id}`
      };
    });

    res.json(validatedUsers);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Invalid data format',
      message: err instanceof Error ? err.message : 'An unknown error occurred'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/users`);
});