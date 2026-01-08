# BuyCycle

BuyCycle is a lightweight e-commerce prototype for showcasing bicycle components and accessories. The project is built with static HTML, CSS, and vanilla JavaScript so it can be deployed on any static hosting provider.

## Features

- Product catalog with category filter and search
- Interactive cart with quantity management and local storage persistence
- Category shortcuts highlighting product counts
- Newsletter capture form with toast confirmation message
- Responsive layout optimized for desktop and mobile devices

## Getting Started

1. Install a simple HTTP server if you do not already have one (examples: `npm install -g serve` or `pip install --user httpserver`).
2. From the project root, launch the server, e.g. `serve .` or `python -m http.server`.
3. Open your browser to the URL shown in the terminal (usually `http://localhost:5000` or `http://localhost:8000`).
4. Browse products, add them to the cart, and review the saved cart state by refreshing the page.

## Extending

- Update `data/products.json` with your live catalog data. The UI automatically attempts to fetch this file and falls back to the built-in sample data if it is unavailable.
- Hook the newsletter form up to your marketing platform by replacing the placeholder toast logic in `assets/js/app.js`.
- Integrate real checkout APIs by wiring the cart data to your preferred payment provider within the `checkout` button handler.
