# EZBOILER

**EzBoiler** is a modern Single Page Application (SPA) for browsing and ordering boiler spare parts. It provides a fast, responsive interface for users to find parts by Brand or Type, view detailed product information, and manage a shopping cart.

## Overview

The project is designed as a **Static Site** powered by **Firebase** for backend services (Firestore Database). It emphasizes specific brand aesthetics, mobile-first navigation, and a frictionless user experience.

### Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6 Modules).
- **Backend**: Firebase Firestore (NoSQL Database).
- **Hosting**: Static Web Hosting (e.g., GitHub Pages, Firebase Hosting).
- **Styling**: Custom CSS with Flexbox/Grid, utilizing `Inter` font family.

## Key Features

### 1. Dynamic Product Catalog

- **Brand Filtering**: Browse parts by major boiler brands (Baxi, Navien, Protherm, etc.).
- **Type Filtering**: Filter by part category (e.g., Valves, Sensors, Boards).
- **Search**: Real-time search by Article Number or Name (Client-side implementation available).

### 2. Mobile-Optimized Navigation

- **Navigation Drawer**: A dedicated slide-out drawer for primary menu links on mobile devices.
- **Brand Grid**: On mobile, brands are displayed in a responsive 2-column grid for easy access.
- **Responsive Header**: Adaptive header that shows essential contact icons on mobile while keeping a clean layout on desktop.

### 3. Shopping Cart & Ordering

- **Local Cart**: Persisted shopping cart using `localStorage`.
- **Checkout**: Simple checkout flow (currently simulated with alerts/modals, integrated with contact forms).

### 4. Interactive Elements

- **Smooth Scrolling**: Auto-scroll interactions when selecting brands.
- **Transitions**: Polished CSS transitions for modals, sidebars, and hover effects.

## Setup & Development

### Prerequisites

- A modern web browser.
- A local web server (e.g., Live Server, `python -m http.server`, or `npm start`).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ezboiler-firebase.git
    cd ezboiler-firebase
    ```
2.  Configuration:
    - Ensure `config.js` contains your valid Firebase configuration object.
    - (`config.js` is git-ignored by default for security).

### Running Locally

Serve the root directory using any static server. For example:

```bash
npx serve .
# OR
python3 -m http.server 3000
```

Open `http://localhost:3000` in your browser.

## Deployment

The project is ready for static deployment.

1.  Build steps are not required (Vanilla JS).
2.  Upload the root directory to your hosting provider.
3.  Ensure `index.html` is the entry point.

## License

[Proprietary / Private Project]
