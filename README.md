# Atoms Demo

AI-driven code generation and visual web development platform demo, inspired by [Atoms](https://atoms.dev/).

## Features

- **User Authentication**: Email/password registration and login
- **Project Management**: Create and manage multiple projects
- **AI Code Generation**: Generate complete HTML applications from text prompts using OpenAI GPT-4o
- **Live Preview**: Real-time preview of generated code
- **Code Editor**: Built-in Monaco Editor for manual editing
- **Component Library**: Save generated components and reuse them in different projects (extended capability)
- **Data Persistence**: SQLite for development, PostgreSQL supported for production

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite / PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4o
- **Editor**: Monaco Editor

## Getting Started

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Initialize Database

```bash
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

This will start:
- Frontend dev server at http://localhost:5173
- Backend API at http://localhost:3001

## Usage

1. Create an account or sign in
2. Create a new project and describe what you want to build
3. AI will generate complete HTML code
4. See the live preview instantly
5. Edit the code manually if needed
6. Ask for additional changes with new prompts
7. Save useful components to your library for reuse later

## Project Structure

```
Atoms_Demo/
├── frontend/                 # React frontend
│   └── src/
│       ├── components/       # UI components
│       ├── hooks/            # Custom hooks
│       ├── pages/            # Page components
│       ├── stores/           # Zustand stores
│       ├── types/            # TypeScript types
│       └── utils/            # Utilities
├── backend/                  # Express backend
│   └── src/
│       ├── routes/           # API routes
│       ├── services/         # Business logic
│       └── middleware/       # Express middleware
├── prisma/                   # Prisma ORM
│   └── schema.prisma         # Database schema
└── start.md                  # Original requirements
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/projects` - List all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/generation` - Generate code with AI
- `GET /api/components` - List user components
- `POST /api/components` - Create component
- `DELETE /api/components/:id` - Delete component

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Set build command: `cd frontend && npm install && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variables in Vercel dashboard
6. Use Supabase for PostgreSQL (free tier available)

## License

MIT
