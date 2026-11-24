# Angarra website

Static site: plain HTML, CSS and JavaScript. No build step, no dependencies.
Total size is about 500 KB, and the home page loads about 270 KB on first visit, fonts and images included.

## Files

- `index.html` – the whole one-page site
- `styles.css` – all styling; the four brand colours are defined at the top
- `main.js` – menu, scroll reveals, ember sparks, launch-story steps, number count-up, sample form
- `fonts/` – self-hosted, subset fonts (Archivo, Instrument Sans, Instrument Serif, Noto Nastaliq Urdu for انگارہ)
- `assets/` – flame logo cut from the brand board, favicons, social share image
- `thanks.html`, `404.html` – form success page and not-found page
- `_headers` – long-cache rules for Netlify and Cloudflare Pages

## Preview on your computer

Open `index.html` in a browser, or for a closer match to hosting run
`python3 -m http.server` inside this folder and visit http://localhost:8000.

## Before going live

1. **Share image link**: after you have a domain, change `content="assets/og.jpg"` in `index.html`
   to the full address, e.g. `https://angarra.pk/assets/og.jpg`, so WhatsApp and Facebook previews show the image.
2. **Contact details**: the brand documents had no phone, email or social links, so none are on the site.
   Add them to the footer in `index.html` when ready.
3. **Sample form**: it uses Netlify Forms and works automatically on Netlify
   (submissions appear under Site → Forms, with email notifications available). On other hosts,
   point the form at a free service such as Formspree by changing the `fetch('/')` URL in `main.js`.

## Deploy (free)

### Netlify (recommended, the sample form works with no setup)
1. Go to app.netlify.com/drop.
2. Drag this whole folder onto the page.
3. The site is live on a `*.netlify.app` address. Add your own domain under Domain management.

### Cloudflare Pages
1. dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets.
2. Upload this folder and deploy. You get a `*.pages.dev` address with unlimited bandwidth.

### Vercel
1. Install the CLI (`npm i -g vercel`), run `vercel` inside this folder, accept the defaults.
   Or push the folder to GitHub and import the repo at vercel.com/new.

### GitHub Pages
1. Create a public repository and upload these files to it.
2. Settings → Pages → Source: Deploy from a branch → `main` / root → Save.
3. The site appears at `https://<username>.github.io/<repo>/`.
