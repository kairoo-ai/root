# Kairoo — Next.js Application

A comprehensive AI-powered career development and learning platform built with Next.js 16, React 19, TypeScript, and Google Gemini AI integration.

## 🚀 Features

- **32+ AI-Powered Career Tools** - From interview coaching to salary negotiation
- **Intelligent Learning Paths** - AI-curated personalized learning journeys
- **Strategic Business Intelligence** - Market analysis and competitive insights
- **Enterprise Team Analytics** - Track and develop team capabilities
- **Real-time AI Integration** - Powered by Google Gemini AI
- **Beautiful Modern UI** - Glassmorphism design with smooth animations

## 📋 Prerequisites

- Node.js 20.9.0 or higher
- npm, yarn, pnpm, or bun
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AstraPath AI"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── route.ts          # Gemini AI API integration
│   ├── business-strategy/
│   │   └── page.tsx               # Business strategy page
│   ├── market-analysis/
│   │   └── page.tsx               # Market analysis page
│   ├── investor-deck/
│   │   └── page.tsx               # Investor resources page
│   ├── technical-architecture/
│   │   └── page.tsx               # Technical architecture page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   ├── Navigation.tsx             # Main navigation component
│   ├── Footer.tsx                 # Footer component
│   ├── Modal.tsx                  # Reusable modal component
│   ├── FeatureModal.tsx           # Feature tool modal
│   ├── IconRenderer.tsx           # Dynamic icon renderer
│   ├── TeamSkillChart.tsx        # Team analytics chart
│   ├── GrowthChart.tsx           # Growth projection chart
│   ├── CompetitiveChart.tsx      # Competitive positioning chart
│   └── ForecastChart.tsx         # Revenue forecast chart
├── lib/
│   └── ai-tools.ts               # Career tools data and utilities
└── public/                       # Static assets
```

## 🎨 Key Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Chart.js** - Data visualization
- **Lucide React** - Beautiful icons
- **Google Gemini AI** - Advanced AI capabilities
- **Zustand** - State management

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 📄 Pages

1. **Home** (`/`) - Main landing page with features, pricing, and testimonials
2. **Business Strategy** (`/business-strategy`) - SaaS validation framework and ICPs
3. **Market Analysis** (`/market-analysis`) - Market research and GTM strategy
4. **Investor Deck** (`/investor-deck`) - Investment materials and projections
5. **Technical Architecture** (`/technical-architecture`) - System design and tech stack

## 🤖 AI Integration

The application uses Google Gemini AI for:
- Career roadmap generation
- Interview coaching
- Salary negotiation guidance
- Learning path creation
- AI tutoring
- And 27+ more career tools

All AI interactions are handled through the `/api/ai` route, which securely communicates with the Gemini API.

## 🎯 Key Improvements Over Original

1. **Modern React Architecture** - Component-based, reusable, maintainable
2. **Type Safety** - Full TypeScript coverage
3. **Better Performance** - Server-side rendering, optimized builds
4. **Enhanced UX** - Smooth animations with Framer Motion
5. **Scalable Structure** - Easy to extend and maintain
6. **Production Ready** - Optimized for deployment

## 🚢 Deployment

The application is ready to deploy on:
- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Easy deployment with CI/CD
- **AWS** - Full control over infrastructure
- **Docker** - Containerized deployment

## 📝 Environment Variables

Required:
- `GEMINI_API_KEY` - Your Google Gemini API key

## 🔒 Security

- API keys are stored securely in environment variables
- All API routes are server-side only
- No sensitive data exposed to the client

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

## 🤝 Contributing

This is a private project. For questions or contributions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for the future of professional development
