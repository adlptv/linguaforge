<div align="center">

# 🌐 LinguaForge — Modern Localization Management Platform

**Self-hosted i18n that developers actually enjoy using**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
</div>

## 📖 What is LinguaForge?

Self-hosted alternatives to Weblate/Lokalise are scarce. Most engineering teams dread the i18n process — JSON/YAML/.po files scattered everywhere, no review workflow, syncing between branches is painful.

LinguaForge is a **DX-first** translation management platform. Auto-detect i18n files in your codebase, suggest machine translations, review workflow, and auto-sync to your repo via CI/CD.

## ✨ Features

- 🔍 **Auto-Scan Codebase** — Detect i18n files: JSON, YAML, .po, iOS .strings, Android XML, .properties
- 🤖 **Machine Translation** — Google Translate / LibreTranslate API for suggestions
- 🧠 **Translation Memory** — Reuse translations across projects
- ✅ **Review Workflow** — Assign translators, approve/reject with comments
- 📸 **Screenshot Context** — Upload screenshots → appears next to strings needing translation
- 🚨 **Missing/Duplicate Key Detector** — Scan all locales, flag issues instantly
- 📤 **Multi-Format Export** — JSON, YAML, .po, .strings, .xml
- 🔄 **Diff View** — See what changed between versions
- 🔧 **CLI Tool** — `linguaforge sync` in CI pipeline → auto PR with translations
- 📊 **Dashboard** — Progress per locale, missing strings, team activity
- 🌓 **Dark/Light Theme**

## 📸 Screenshots

| Landing Page | Dashboard |
|:---:|:---:|
| ![Linguaforge Hero](screenshots/hero.png) | ![Linguaforge Dashboard](screenshots/dashboard.png) |

> 💡 *Run locally to see the full interactive experience: `pnpm dev` then open http://localhost:3000*


## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│               LinguaForge                      │
├──────────────┬──────────────┬────────────────┤
│   Frontend   │   Backend    │   Parsers      │
│  Next.js 14  │  API Routes  │  JSON/YAML     │
│  shadcn/ui   │  Prisma ORM  │  .po/.strings  │
│  Framer      │  SQLite      │  .xml/.properties│
│  CLI Tool    │  Git Sync    │  TM Engine     │
└──────────────┴──────────────┴────────────────┘
```

## 🚀 Quick Start

```bash
git clone https://github.com/adlptv/linguaforge.git
cd linguaforge
pnpm install
pnpm dev
```

Docker:
```bash
docker-compose up
```

## 📊 Supported Formats

| Format | Import | Export | Auto-Detect |
|--------|--------|--------|-------------|
| JSON (i18next) | ✅ | ✅ | ✅ |
| YAML | ✅ | ✅ | ✅ |
| .po (gettext) | ✅ | ✅ | ✅ |
| .strings (iOS) | ✅ | ✅ | ✅ |
| .xml (Android) | ✅ | ✅ | ✅ |
| .properties (Java) | ✅ | ✅ | ✅ |

## 🔧 CLI Usage

```bash
# Sync translations from LinguaForge to your repo
npx linguaforge sync --project-id abc123 --token $LF_TOKEN

# In CI (GitHub Actions)
- name: Sync translations
  run: npx linguaforge sync --token ${{ secrets.LF_TOKEN }}
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/projects` | List/create projects |
| GET/PUT/DELETE | `/api/projects/[id]` | Manage project |
| GET/POST | `/api/projects/[id]/strings` | List/add strings |
| GET/PUT/DELETE | `/api/projects/[id]/strings/[sid]` | Edit string |
| POST | `/api/projects/[id]/import` | Import i18n file |
| GET | `/api/projects/[id]/export` | Export translations |
| POST | `/api/projects/[id]/scan` | Scan for issues |
| GET/POST | `/api/translation-memory` | TM entries |
| GET | `/api/health` | Health check |

## 🔒 Security

- ✅ Zod validation all routes
- ✅ RBAC (admin/translator/viewer)
- ✅ API key auth for CLI
- ✅ Rate limiting
- ✅ Helmet.js headers

## 📄 License

MIT © [adlptv](https://github.com/adlptv)

---

⭐ Star to support the project!
