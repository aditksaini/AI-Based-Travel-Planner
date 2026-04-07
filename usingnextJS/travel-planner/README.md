 🌍 AI-Based Travel Planner

**AI-Based Travel Planner** is an intelligent, modern web application built with [Next.js](https://nextjs.org/) that helps you plan your perfect trip. By leveraging advanced AI, interactive maps, and real-time weather data, this app generates personalized itineraries, calculates routes, and tracks your travel budget effortlessly.

![Travel Planner Banner](./public/favicon.ico) *<!-- Add a proper banner image here if available -->*

## ✨ Features

- **🤖 AI-Powered Suggestions**: Get smart, personalized itinerary recommendations tailored to your destination, duration, and budget. Generated using Google's Gemini API.
- **🗺️ Map-Based Itineraries**: Visualize your trip with interactive maps outlining your daily routes. Uses `Leaflet` and `react-leaflet`.
- **💰 Real-Time Cost Tracking**: Continuous monitoring of your estimated expenses to ensure optimal budget allocation.
- **🌤️ Dynamic Scheduling & Weather Advice**: Auto-adjusting timelines with real-time weather integration (via OpenWeather API) so you know exactly what to expect.
- **📄 Instant PDF Export**: Loved your generated itinerary? Export it directly to a beautifully formatted PDF document for offline access.
- **💬 Smart Chat Overlay**: An integrated chat interface to interact with your travel assistant while planning.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **UI & Styling**: React 19, [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Maps & Routing**: [Leaflet](https://leafletjs.com/), `react-leaflet`, Graphhopper API
- **Exporting**: `jsPDF`, `html2canvas`
- **AI & Integrations**: Google Gemini (via `generativelanguage.googleapis.com`), OpenWeatherMap API

## 📂 Project Structure

This project follows the Next.js App Router architecture and is efficiently organized:

```text
travel-planner/
├── public/                # Static assets (favicons, images, etc.)
├── src/                   # Application source code
│   ├── actions/           # Server actions for async mutations
│   ├── app/               # Next.js App Router root directory
│   │   ├── api/           # Backend API endpoints (Gemini, Weather, Maps. etc)
│   │   ├── trips/         # Dynamic routing for generated trip views
│   │   ├── globals.css    # Global Tailwind styles & custom CSS
│   │   ├── layout.tsx     # Root HTML/Body layout wrapping all pages
│   │   └── page.tsx       # Main landing page route
│   ├── components/        # Reusable, modular React UI components
│   │   ├── ChatOverlay.tsx      # Interactive AI chat interface
│   │   ├── ExportPdfButton.tsx  # Logic and UI for beautiful PDF exports
│   │   ├── WeatherWidget.tsx    # Live OpenWeather integration card
│   │   └── ...                  # Maps, Layout components, and features
│   ├── hooks/             # Custom React hooks to encapsulate logic
│   ├── lib/               # Utility functions and third-party helpers
│   ├── store/             # Zustand global state management
│   │   └── useTripStore.ts# Handles central state for active itineraries
│   └── types/             # Shared TypeScript type definitions
├── .env.local             # Local environment secrets needed to run the app
├── package.json           # Core dependencies and project run scripts
└── next.config.ts         # General Next.js build configuration
```

---

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### Prerequisites

You need Node.js installed on your machine. We recommend using `npm`, `yarn`, `pnpm`, or `bun` to manage packages.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/AI-Based-Travel-Planner.git
cd AI-Based-Travel-Planner/usingnextJS/travel-planner
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (where `package.json` is located) and add the necessary API keys:

```env
# Google Gemini API key for itinerary generation
GEMINI_API_KEY=your_gemini_api_key_here

# OpenWeather API key for weather widget
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Other keys that might be required
# NEXT_PUBLIC_GRAPHHOPPER_API_KEY=...
# NEXT_PUBLIC_UNSPLASH_API_KEY=...
```

### 3. Run the Development Server

Start the application on your local server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
