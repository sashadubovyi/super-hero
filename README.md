# 🦸 SuperHero App

A Netflix-style superhero encyclopedia built with React + Vite, powered by the SuperheroAPI. Browse heroes by category, search across 700+ characters, and explore detailed stats — all in a fast, dark-themed UI.

**Live demo:** [super-hero-taupe.vercel.app](https://super-hero-taupe.vercel.app)  
**Repository:** [github.com/sashadubovyi/super-hero](https://github.com/sashadubovyi/super-hero)

---

## 📸 Screenshots

> Hero banner with auto-rotation, horizontal rows, and detailed character pages.

---

## ✨ Features

- 🎬 **Netflix-style hero banner** — auto-rotates every 10 seconds with smooth fade transition
- 🗂️ **Category rows** — horizontal scrollable rows: Marvel Heroes, DC Heroes, Strongest, Smartest, Villains
- 🔍 **Debounced search** — live search across 700+ heroes with 350ms debounce, skeleton loaders
- 📋 **Detailed hero page** — powerstats with animated progress bars, biography, appearance, work info
- 🖼️ **Reliable images** — sourced from [Akabab Superhero API](https://github.com/akabab/superhero-api) via jsDelivr CDN (no hotlink bans)
- 🔒 **Secure API proxy** — SuperheroAPI token never exposed to the browser, handled server-side via Vercel Serverless Functions
- 💀 **Skeleton loaders** — shimmer placeholders while content loads, no layout shifts
- 📱 **Responsive** — works on mobile, tablet, and desktop
- ⬅️ **Smart back button** — returns to previous page or home if opened via direct link

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build tool | [Vite 8](https://vite.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Deployment | [Vercel](https://vercel.com/) |
| Hero data | [SuperheroAPI](https://superheroapi.com/) |
| Hero images | [Akabab Superhero API](https://akabab.github.io/superhero-api/) via [jsDelivr](https://www.jsdelivr.com/) |
| Styling | Plain CSS with BEM naming convention |
| Dev environment | [GitHub Codespaces](https://github.com/features/codespaces) |

---

## 🏗️ Project Structure

```
super-hero/
├── api/                        # Vercel Serverless Functions
│   └── superhero.js            # Proxy for SuperheroAPI (hides token, bypasses CORS)
├── public/                     # Static assets
├── src/
│   ├── api/
│   │   ├── superhero.js        # Frontend API client (getHeroById, searchHeroes, getHeroesByIds)
│   │   └── akabab.js           # Akabab API client for images (getHeroImageUrl)
│   ├── components/
│   │   ├── Header.jsx/css      # Sticky header with logo and search input
│   │   ├── Layout.jsx          # Page wrapper with Header + Outlet
│   │   ├── HeroBanner.jsx/css  # Full-width auto-rotating featured hero banner
│   │   ├── HeroRow.jsx/css     # Horizontal scrollable row with arrow buttons
│   │   ├── HeroCard.jsx/css    # Clickable hero card with hover scale effect
│   │   └── HeroImage.jsx       # Image component with automatic fallback placeholder
│   ├── data/
│   │   └── categories.js       # Hardcoded hero ID lists for each category + featured banner
│   ├── hooks/
│   │   └── useDebounce.js      # Debounce hook (delays value update, prevents API spam)
│   ├── pages/
│   │   ├── Home.jsx            # Main page: banner + category rows
│   │   ├── Search.jsx/css      # Search page with debounce, skeletons, results grid
│   │   ├── Hero.jsx/css        # Hero detail page: poster, stats, biography
│   │   └── NotFound.jsx        # 404 page
│   ├── utils/
│   │   └── random.js           # randomItem() helper (used for banner rotation)
│   ├── App.jsx                 # Router setup with Layout route
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + CSS reset
├── .env.local                  # Local environment variables (gitignored)
├── vite.config.js              # Vite config with dev proxy for API + images
└── package.json
```

---

## 🔒 Security & Architecture

### API Token Protection

The SuperheroAPI token is never exposed to the browser. All requests go through a proxy:

```
Browser → /api/superhero?path=/70
              ↓
    Vercel Serverless Function (api/superhero.js)
              ↓  token added server-side
    https://www.superheroapi.com/api.php/{TOKEN}/70
```

In local development, Vite's built-in proxy (`server.proxy` in `vite.config.js`) handles this the same way — reads the token from `.env.local` and rewrites the request path. The frontend code never changes between dev and production.

### Image Source

Originally the app used SuperheroAPI's image URLs (hosted on `superherodb.com`), but that domain aggressively blocks datacenter IPs (Cloudflare-based hotlink protection). Switched to **Akabab Superhero API** images hosted on jsDelivr CDN — publicly accessible, fast globally, no restrictions.

### Race Condition Prevention

All async data fetching uses a `cancelled` flag pattern to prevent stale responses from overwriting newer ones:

```javascript
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setState(data);
  });
  return () => { cancelled = true; };
}, [dependency]);
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free API token from [superheroapi.com](https://superheroapi.com/) (login with GitHub)

### Installation

```bash
# Clone the repository
git clone https://github.com/sashadubovyi/super-hero.git
cd super-hero

# Install dependencies
npm install

# Create local environment file
echo "SUPERHERO_TOKEN=your_token_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## ☁️ Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects **Vite** as the framework
4. Add environment variable: `SUPERHERO_TOKEN` = your token
5. Click **Deploy**

Every push to `main` triggers an automatic redeploy.

> ⚠️ Do not use GitHub Pages for this project — it only serves static files and cannot run the serverless proxy function that hides the API token.

---

## 🎨 Design Decisions

### Why plain CSS over Tailwind/styled-components?
Keeping dependencies minimal. Plain CSS with BEM naming is explicit, fast, and easy to debug. No build-time surprises.

### Why hardcode hero ID lists?
SuperheroAPI has no endpoint to filter by publisher or alignment — only search by name or fetch by ID. Hardcoded lists give us full control over what appears in each category row.

### Why `Promise.allSettled` instead of `Promise.all`?
When loading a row of 12 heroes in parallel, one bad ID shouldn't break the whole row. `allSettled` lets us show 11 successful cards and silently skip the failed one.

### Why debounce search at 350ms?
Balances responsiveness with API efficiency. Typing "batman" (6 chars) fires only 1 request instead of 6. The URL updates instantly (so the browser history works correctly), but the actual API call waits.

---

## 📡 API Reference

### SuperheroAPI (via proxy)

| Endpoint | Description |
|---|---|
| `GET /api/superhero?path=/{id}` | Get hero by ID (1–731) |
| `GET /api/superhero?path=/search/{name}` | Search heroes by name |

### Akabab Superhero API (direct, no auth)

| Endpoint | Description |
|---|---|
| `GET https://akabab.github.io/superhero-api/api/id/{id}.json` | Get hero image URLs by ID |

---

## 📝 License

MIT — feel free to use, modify, and distribute.

---

## 🙏 Credits

- Hero data: [SuperheroAPI](https://superheroapi.com/)
- Hero images: [akabab/superhero-api](https://github.com/akabab/superhero-api)
- Image CDN: [jsDelivr](https://www.jsdelivr.com/)
- Inspiration: Netflix UI/UX patterns