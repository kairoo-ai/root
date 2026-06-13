# Kairoo Project Analysis

This document provides a summary of the Kairoo project, a comprehensive AI-powered career development and learning platform.

## Project Overview

- **Project Name:** Kairoo
- **Description:** An AI-powered platform for career development, learning, and business intelligence.
- **Framework:** Next.js 16 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion
- **AI:** Google Gemini AI

## Key Features

- **AI Career Tools:** Over 32 tools for resume building, interview prep, and more.
- **Learning Paths:** AI-curated learning journeys.
- **Business Intelligence:** Market analysis and competitive insights.
- **Team Analytics:** Tools for tracking team skills and development.

## Project Structure

The project follows a standard Next.js App Router structure.

- `app/`: Contains the application's pages and API routes.
  - `api/ai/route.ts`: Handles all communication with the Google Gemini AI.
  - `(pages)/`: Separate directories for each main page of the application.
- `components/`: Reusable React components.
- `lib/`: Utility functions and data, including AI tool definitions.
- `public/`: Static assets.

## Technical Details

- **State Management:** Zustand
- **UI Components:** HeroUI, custom components
- **Data Visualization:** Chart.js
- **Icons:** Lucide React

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set up Environment Variables:**
    Create a `.env.local` file with your `GEMINI_API_KEY`.
    ```
    GEMINI_API_KEY=your_gemini_api_key
    ```
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:1254`.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run kill`: Stops the process running on port 1254.
