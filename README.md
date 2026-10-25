# Kanji Checklist

A free website where Japanese learners track their kanji progress by JLPT level (N5 to N1).

Built with Next.js, TypeScript, Tailwind CSS and Supabase.

## First-time setup

1. Install **Node.js LTS** from https://nodejs.org (choose the "LTS" version). Close and reopen VS Code afterwards.
2. Open this folder in VS Code, then open a terminal: **Terminal > New Terminal**.
3. Download the libraries the project uses:

   ```
   npm install
   ```

4. Create your settings file:
   - Copy `.env.example` and name the copy `.env.local` (in the same folder).
   - In the Supabase dashboard, open your project, then **Project Settings > Data API** for the Project URL, and **Project Settings > API Keys** for the publishable key.
   - Paste them after the `=` signs in `.env.local`, with no spaces or quotes. The URL should end in `.supabase.co`, with nothing after it (no `/rest/v1/`).
   - `.env.local` is private and is never uploaded to GitHub.

## Running the site on your computer

```
npm run dev
```

Then open http://localhost:3000 in your browser. Press `Ctrl + C` in the terminal to stop it.

The page updates automatically when you save a file. If you change `.env.local`, stop and restart `npm run dev`.

## Checking your work

```
npm run lint
npm run build
```

`lint` checks the code style. `build` makes a production version of the site and catches errors. Both should finish without errors before committing.

## Project layout

- `src/app/`: the pages of the site
- `src/components/`: reusable pieces of the page
- `src/lib/supabase/`: code for talking to Supabase (`client.ts` for the browser, `server.ts` for the server)
- `CLAUDE.md`: project rules and roadmap for Claude Code
