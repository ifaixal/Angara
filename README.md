# Angarra Website

**Live site:** [https://agnarra.vercel.app](https://agnarra.vercel.app)

A fast, lightweight static website built with plain HTML, CSS, and JavaScript—no build step and no external dependencies. The entire project is ~500 KB, and the home page loads ~270 KB on first visit (fonts and images included).

## Project Structure

- `index.html` – Main one-page website
- `styles.css` – Complete stylesheet (brand colors are defined as CSS variables at the top)
- `main.js` – Navigation menu, scroll reveals, ember sparks, launch-story steps, number count-up, and sample form handler
- `fonts/` – Self-hosted, subset fonts (`Archivo`, `Instrument Sans`, `Instrument Serif`, and `Noto Nastaliq Urdu` for انگارہ)
- `assets/` – Flame logo, favicons, and social share (`og.jpg`) image
- `thanks.html` & `404.html` – Form submission confirmation and custom not-found pages
- `_headers` – Cache-control rules (for Netlify/Cloudflare Pages compatibility)

## Local Development

Open `index.html` directly in your browser, or serve the folder locally to match production behavior:

```bash
python3 -m http.server 8000
