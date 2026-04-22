const path = require('path');
// Try multiple locations for .env to work in both development and production
const envPaths = [
  path.resolve(__dirname, '../../../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(process.cwd(), '.env'),
];

for (const p of envPaths) {
  const fs = require('fs');
  if (fs.existsSync(p)) {
    require('dotenv').config({ path: p });
    console.log('Loaded env from:', p);
    break;
  }
}

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import generationRoutes from './routes/generation';
import componentRoutes from './routes/components';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/generation', generationRoutes);
app.use('/api/components', componentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Atoms Demo API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { prisma };
