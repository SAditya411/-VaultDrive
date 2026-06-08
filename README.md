# VaultDrive

VaultDrive is a premium single-user personal cloud drive built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

It supports drag-and-drop multi-file uploads, folder organization, search, sorting, previews, downloads, deletion, and a lightweight access-code lock screen. There is no signup, registration, or Supabase Auth requirement.

## Project Structure

```txt
app/
  (protected)/          Dashboard, files, folders, settings routes
  api/access/           Server-side ACCESS_CODE verification
  lock/                 First-visit lock screen
components/
  dashboard/            Stats, storage, recent upload widgets
  files/                File cards, file grid, preview modal, empty states
  folders/              Folder cards and folder grid
  layout/               Sidebar and top navigation
  lock/                 Lock screen UI
  ui/                   Modal, search, sort, progress, skeletons
  upload/               Upload modal and drag/drop zone
lib/
  hooks/                Files, folders, and upload hooks
  supabase/             Supabase client and server actions
  utils/                File type and formatting helpers
supabase/schema.sql     Database tables, indexes, and vault bucket setup
types/index.ts          Shared TypeScript types
```

## Environment Variables

Create `.env.local` from `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ACCESS_CODE=change-this-code
```

`ACCESS_CODE` is checked only on the server through `/api/access`. The browser stores the unlocked state in `localStorage` as `vaultdrive_auth=true`.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Confirm the Storage bucket is named `vault`.
4. Copy your project URL and anon key into `.env.local`.

The schema creates:

- `files`: uploaded file metadata.
- `folders`: folder records for organization.
- Storage bucket: `vault`.

This app is designed for a private single-user deployment. The included SQL disables RLS for simplicity because there is no Supabase Auth layer. For a public or multi-user app, add Supabase Auth and RLS policies before deployment.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). On first visit, enter the `ACCESS_CODE`.

## Production Build

```bash
npm run lint
npm run build
npm run start
```

## Deploy To Vercel

1. Push the project to GitHub.
2. Import it in Vercel.
3. Add these environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ACCESS_CODE`
4. Deploy.

After deployment, visit the Vercel URL, unlock VaultDrive with your access code, and upload a small test file to verify Supabase Storage and metadata inserts.
