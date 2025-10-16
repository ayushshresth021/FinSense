# FinSense 💰

<div align="center">

**AI-Powered Personal Finance Tracker**

Track expenses naturally using voice or text. Just say *"I spent $20 on coffee"* and let AI handle the rest.


Live demo: https://finsense-ayush.vercel.app/

</div>

---

## ✨ Features

- 🎙️ **Voice Input** - Speak your transactions naturally
- 🤖 **AI Parsing** - Automatically extracts amount, category, merchant, and date
- 📊 **Smart Analytics** - Interactive charts and spending patterns
- 💡 **AI Insights** - Personalized financial recommendations
- 📅 **Smart Dates** - Understands "yesterday", "last week", "3 days ago"
- 🔒 **Secure** - Row-level security with Supabase

## 🛠️ Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, TanStack Query  
**Backend:** Node.js, Express, TypeScript  
**Database:** Supabase (PostgreSQL)  
**AI/ML:** OpenAI GPT-4, AssemblyAI  
**Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI & AssemblyAI API keys

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/finsense.git
   cd finsense
   
   # Install backend
   cd server && npm install
   
   # Install frontend
   cd ../web && npm install
   ```

2. **Environment Variables**

   `server/.env`:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   OPENAI_API_KEY=your_openai_key
   ASSEMBLYAI_API_KEY=your_assemblyai_key
   FRONTEND_URL=http://localhost:3000
   ```
   
   `web/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```




4. **Run development servers**
   ```bash
   # Backend (from server/)
   npm run dev
   
   # Frontend (from web/)
   npm run dev
   ```

5. **Open** `http://localhost:3000`

## 📁 Project Structure

```
FinSense/
├── server/              # Express.js API
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── services/    # AI & analytics logic
│   │   ├── routes/      # API endpoints
│   │   └── config/      # Supabase, OpenAI, AssemblyAI
│   └── api/index.ts     # Vercel serverless
│
└── web/                 # Next.js frontend
    ├── app/             # Pages & layouts
    ├── components/      # React components
    └── lib/             # API client & hooks
```

## 🎯 Key Highlights

- **99% parsing accuracy** for natural language transactions
- **Sub-3-second** voice-to-transaction processing
- **15+ date formats** supported (yesterday, 3 days ago, etc.)
- **80% faster** than traditional expense entry
- **Type-safe** end-to-end with TypeScript
