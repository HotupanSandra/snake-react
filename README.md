# 🐍 Snake Game

A retro CRT-terminal Snake game built with React, Vite, and Tailwind CSS.

## Preview

> Phosphor-green snake on a dark terminal board with scanline overlay, glow effects, and screen flicker.

## Features

- Classic Snake gameplay on a 20×20 grid
- CRT / phosphor-green terminal aesthetic
- Speed increases as your score climbs
- High score saved in `localStorage`
- Pause & Resume support
- On-screen D-pad for mobile
- Keyboard controls: Arrow keys or WASD · Space / Enter to start or pause

## Tech Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [Tailwind CSS v3](https://tailwindcss.com)
- Pure React hooks — no external game libraries

## Getting Started

### Prerequisites

- Node.js v18 or higher

### Install & Run
```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

## Controls

| Key | Action |
|-----|--------|
| Arrow keys / WASD | Move the snake |
| Space / Enter | Start · Pause · Resume |
| On-screen D-pad | Mobile controls |

## Project Structure