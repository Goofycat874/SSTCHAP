# Inside the Vidhan Sabha

Interactive civics chapter site (React + Framer Motion, bundled with esbuild into one static page).

## Run locally
npm install
npm run build
npm run preview

## Deploy on Vercel
- Framework Preset: Other
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install

(vercel.json already sets these, so the defaults work.)

The motion video is pre-rendered at public/inside-the-vidhan-sabha.mp4 and is copied to the site root on build.

## Music
The piano score and sound effects are original and synthesized in code by `tools/score.py` (needs numpy + scipy). It writes a WAV that is encoded to `src/music.mp3` and mixed into the MP4.

Made by Suryansh Swaries.
