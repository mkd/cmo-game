# The Growth Engine: CMO Strategy Simulator

**The Growth Engine** is a simple, highly visual, 8-bit aesthetic web-based simulation game designed for Chief Marketing Officers (CMOs). 

The game challenges players to grow a fictional brand's Market Share and Revenue over a 5-year period by applying core principles from two major marketing frameworks:
* **Strategic Marketing Management** by Alexander Chernev (The 5Cs, STP, Value Proposition).
* **How Brands Grow** by Byron Sharp (Mental Availability, Physical Availability, Distinctive Brand Assets).

## Features
* **Retro 8-bit UI**: "Monkey Island" inspired visuals with custom pixel fonts, blocky borders, and sharp color contrasts.
* **Turn-based Engine**: 5 distinct market events (years) where players must evaluate the "Context" and allocate their budget.
* **Empirical Growth Math**: The internal engine mathematically proves that maintaining consistent Distinctive Brand Assets (DBAs) and investing in broad mental/physical availability drives penetration far more effectively than hyper-segmentation or constant rebranding.

## Tech Stack
* **Core**: React (initialized via Vite)
* **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, and pseudo-elements for pixel art borders)
* **Fonts**: Google Fonts (`Press Start 2P` & `VT323`)
* **Deployment**: Static Site Export via Vite (`npm run build`), ready for 0-config, backend-less hosting.

## Running Locally

To run the simulation locally on your machine:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. Open your browser to the local port provided in the terminal (usually `http://localhost:5173`).

## Building for Production

To create a static production build:

```bash
npm run build
```

This will generate a `dist/` directory containing all your static HTML, JavaScript, and CSS. You can upload the contents of the `dist/` folder directly to your web server (e.g., Namecheap shared hosting, Netlify, Vercel, or GitHub Pages).

---
*Created for www.claudiocamacho.com*
