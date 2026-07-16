# MERF Standalone Static Outer Admin Portal

This is a standalone, **strictly static client-only administrative console** for the **Maurya Education and Research Foundation (MERF)** website. It is built entirely in **HTML, CSS, and vanilla JavaScript** without any Node.js, Express, or backend dependencies.

You can open and run this admin panel directly in your browser!

---

## Features

1. **Strictly Client-Only (No Node.js):** Zero terminal commands required to run. No server dependencies.
2. **Direct Supabase Sync:** Performs fetches, inserts, and deletes directly from the browser using the `@supabase/supabase-js` CDN library.
3. **Direct Google Drive uploads:** Uploads files (book covers, article covers, PDF documents) directly from your browser to Google Drive using the Google Identity Services client and Google Drive REST API.
4. **Environment Variables & Fallback Configs:**
   * **Local Server Mode:** If hosted on any local web server (like VS Code Live Server, Python's SimpleHTTPServer, PHP server, etc.), the panel fetches and parses the `.env` file near it automatically.
   * **File Protocol Mode:** If opened directly by double-clicking `index.html` in your file explorer (`file://` protocol), the browser bypasses local file fetch restrictions by reading credentials from [`config.js`](file:///C:/Users/rkste/.gemini/antigravity/scratch/merf-website/outer-admin/config.js) instead.

---

## How to Set Up Credentials

Choose **one** of the following setups:

### Setup Option A: Edit `config.js` (Recommended for double-clicking index.html)
Open [`config.js`](file:///C:/Users/rkste/.gemini/antigravity/scratch/merf-website/outer-admin/config.js) in your text editor and update the fields:
```javascript
window.MERF_CONFIG = {
    supabaseUrl: "https://your_project.supabase.co",
    supabaseAnonKey: "your_anon_key",
    googleClientId: "your_google_web_client_id",
    folderBooks: "folder_id_for_books",
    folderJournalCovers: "folder_id_for_covers",
    folderJournalPdfs: "folder_id_for_pdfs"
};
```

### Setup Option B: Edit `.env` (For local web servers)
Open [`.env`](file:///C:/Users/rkste/.gemini/antigravity/scratch/merf-website/outer-admin/.env) in your text editor and update the keys:
```env
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
GOOGLE_CLIENT_ID=your_google_web_client_id
FOLDER_BOOKS=folder_id_for_books
FOLDER_JOURNAL_COVERS=folder_id_for_covers
FOLDER_JOURNAL_PDFS=folder_id_for_pdfs
```

---

## How to Run:
* **Method 1 (Double-Click):** Simply double-click [`index.html`](file:///C:/Users/rkste/.gemini/antigravity/scratch/merf-website/outer-admin/index.html) to open it in Chrome, Edge, Safari, or Firefox.
* **Method 2 (Live Server / Static Hosting):** Open the `outer-admin` folder in VS Code, right-click `index.html` and click **"Open with Live Server"**, or host it on Github Pages, Netlify, or Vercel as a static webpage.

---

## Google Drive Upload Integration:
1. Open the page and click the orange **"Authorize Google Drive"** button.
2. Sign in with your Gmail account and grant Google Drive permissions in the popup.
3. Once authorized, the warning bar will disappear and show **"Connected"**. You can now upload files directly to your configured Google Drive folders. If you delete any entry from the tables, the file is automatically deleted from Google Drive!
4. **Fallback:** If you don't authorize Google Drive, you can still paste Google Drive shareable links manually, or use the file upload inputs to generate simulated fallback URLs for testing.
