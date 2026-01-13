# Lark - Team Collaboration Platform

A full-featured Lark-like team collaboration application built with Next.js, TypeScript, Firebase, and Tailwind CSS.

## 🎯 Features

### 💬 Messenger (Chat)
- Real-time 1:1 and group chat
- Emoji reactions on messages
- File attachment support

### 📁 Docs & Drive
- Upload and manage files
- Create new documents
- Share documents with team members

### 📅 Calendar
- Monthly, weekly, and daily views
- Create and manage events
- Invite participants

### 👥 Contacts
- Organization contacts database
- Add, edit, and delete contacts
- Group management

### ✅ Tasks
- Create tasks with due dates
- Assign to team members
- Priority levels and status tracking

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com/
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration values

3. **Run the development server:**
```bash
npm run dev
```

4. **Open in browser:**
   - Navigate to `http://localhost:3000`

## 🎨 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Backend**: Firebase (Realtime Database, Storage)
- **Date**: date-fns

## 🐛 Development

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## 🚀 Deployment

Deploy to Vercel by connecting your GitHub repository and adding environment variables.

Built with ❤️ as a Lark-like collaboration platform
