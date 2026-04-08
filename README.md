# Vtiger SmartFix 🚀

Vtiger SmartFix is a powerful Chrome extension that acts as a smart AI companion for Vtiger CRM. It leverages **Google Gemini 2.0 Flash** to provide instant ticket analysis, health diagnostics, and intelligent knowledge base search.

![SmartFix Banner](https://images.unsplash.com/photo-1551288049-bbbda5402bd7?auto=format&fit=crop&q=80&w=1000)

## Features

### 🧠 AI-Powered Ticket Assistant
- **Contextual Analysis**: Automatically detects ticket data when you are on a Vtiger ticket page.
- **Instant Summaries**: AI summarizes complex support tickets in seconds.
- **Smart Replies**: Generates professional, ready-to-use email templates and reply suggestions.

### 🛡️ One-Click Health Check & Auto-Fix
- **Deep Diagnostics**: Checks API connectivity, database performance, and common update-related bugs.
- **System Integrity**: Validates if your workflows and extensions are firing correctly.
- **Safe Fixes**: Offers one-click buttons to resolve common configuration issues.

### 🔍 Smart Knowledge Base Search
- **AI-Powered Search**: Ask anything in natural language.
- **Multi-Source**: Searches official Vtiger docs, common community issues, and your own instance data.
- **Quick Actions**: Direct links to official documentation and community forums.

---

## Tech Stack
- **Extension**: React 18, TypeScript, Vite, Manifest V3, Tailwind CSS, shadcn/ui, Zustand.
- **Backend**: Node.js 20, Express, TypeScript, Zod.
- **AI**: Google Gemini 2.0 Flash API (@google/generative-ai).

---

## Installation & Setup

### 1. Preparation
- **Gemini API Key**: Get your key from [Google AI Studio](https://aistudio.google.com/).
- **Vtiger Credentials**: You will need your Vtiger URL, Username, and Access Key (found under *My Preferences -> Access Key*).

### 2. Backend Setup
1. Navigate to the `backend/` folder.
2. Copy `.env.example` to `.env` and fill in your `GEMINI_API_KEY`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Extension Setup (Chrome)
1. Navigate to the `extension/` folder.
2. Install dependencies and build the extension:
   ```bash
   npm install
   npm run build
   ```
3. Open Google Chrome and go to `chrome://extensions/`.
4. Turn on **Developer mode** (top right).
5. Click **Load unpacked** and select the `extension/dist` folder.

### 4. Configuration
1. Click the **Vtiger SmartFix** icon in your extension bar.
2. Go to the **Settings** page.
3. Enter your Vtiger URL, Username, and Access Key.
4. Click **Test & Save Config**.
5. Once successful, you are ready to use SmartFix!

---

## Development

To run both backend and extension in dev mode:
```bash
# Root directory
npm run backend
npm run extension:dev
```

---

## License
MIT
