# Travel Path 🗺️

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

Travel Path is a full-stack, comprehensive travel booking and itinerary planning application. Crafted with modern web technologies, it provides users with seamless trip management, interactive map browsing, and dynamic itineraries. Alongside the user journey, administrators are equipped with a powerful analytics dashboard to monitor engagement and manage platform content.

## ✨ Features

- **Secure Authentication**: Robust user sign-up and login powered by Supabase Auth, integrating seamless OAuth providers (like Google).
- **Dynamic Trip Planning**: Browse destinations visually through interactive maps (`react-leaflet`) and generate personalized travel itineraries.
- **Comprehensive Admin Dashboard**: Centralized analytics dashboard featuring visual chart reporting (`Chart.js`) to deeply monitor user engagement, popular destinations, and blog interactions.
- **Content Management System (CMS)**: Fully integrated blog management platform with rich features for publishing, hiding, and deleting articles directly from the admin panel.
- **Responsive & Dynamic UI**: A fluid interface built strictly with Tailwind CSS and enhanced with Framer Motion animations for a premium user experience across all device sizes.
- **Performance Optimized**: Architected for speed using Next.js Server Components, Server Actions, and integrated edge analytics via Vercel Speed Insights.

## 🛠️ Tech Stack

- **Frontend Engine**: Next.js 15 (App Router), React 19
- **Styling & UI**: Tailwind CSS 4, Framer Motion, Lucide React
- **Backend & API**: Next.js Server Actions, Prisma ORM
- **Database & Services**: Supabase (PostgreSQL, Storage, Auth)
- **Email Delivery**: Resend & React Email
- **Data Visualization & Cartography**: Chart.js, Leaflet

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- A [Supabase](https://supabase.com/) project configured

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/travel-path.git
   cd travel-path/web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory mapping exactly to your remote services:
   ```env
   # Supabase Keys
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Prisma Database URL
   DATABASE_URL=your_prisma_connection_string

   # Resend Email Key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Database Migration:**
   Generate the Prisma client and push your schema to the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js application routes (App Router). Includes main pages, specific feature directories, and `/admin` paths.
- `components/`: Reusable React components, structured logically by features (e.g., UI, Charts, Forms).
- `prisma/`: Prisma schema and database configuration.
- `lib/` & `utils/`: Core utilities, helper functions, and API configurations (e.g., Supabase clients).
- `scripts/`: Internal toolchain scripts for database seeding, maintenance, and diagnostics.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
