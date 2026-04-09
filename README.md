# BookMySeat 🍿

**BookMySeat** is a premium, fully responsive movie theater reservation system engineered to deliver a world-class, seamless ticket booking experience. Designed from the ground up to embody a hyper-modern aesthetic, it proves that sophisticated architecture and stunning visuals can be built without relying on heavy front-end frameworks.

---

## 📸 Overview
Developed as a rigorous academic project, this application provides users with an end-to-end cinematic booking journey:
1. **Authentication:** Secure account creation and login via Firebase.
2. **Movie Selection:** Landing page with dynamic routing to pre-select movie tiers and showtimes.
3. **Seating Matrix:** A deeply interactive visual theater map engineered using native HTML checkboxes and the HTML5 Canvas API.
4. **Checkout Engine:** A real-time pricing calculator that triggers automated, serverless digital ticket delivery upon completion.

---

## 🚀 Tech Stack & Core Technologies

This application strictly adheres to fundamental Web Standards (Vanilla DOM Manipulation) to ensure maximum performance and readable logic.
* **Core:** HTML5, CSS3, JavaScript (ES6+ Vanilla)
* **Design & UI:** Core CSS Grid & Flexbox, Custom CSS Variables, Glassmorphism Backdrops (`backdrop-filter`)
* **Typography:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via Google Fonts
* **Backend Services:**
  * [**Firebase Auth (`v8 compat CDN`)**](https://firebase.google.com/docs/auth) for user session management.
  * [**EmailJS**](https://www.emailjs.com/) for automated transactional email receipts.

---

## 🔥 Key Features
* **Zero Framework Dependency:** No React, Vue, or Tailwind. Entirely built via raw Document Object Model (DOM) logic and native CSS.
* **Canvas Cinema Screen:** The glowing theater screen is dynamically rendered using the native HTML5 `<canvas>` API via complex Quadratic Curves, replacing static image assets.
* **Smart UI Components:** 
  * "Unavailable" versus "Reserved" versus "Available" seat states automatically calculate prices and interact flawlessly.
  * Central aisle mapping using CSS `:nth-child()` offset targeting.
* **Live Mathematical DOM:** The ticket price, seat count, and total calculation update synchronously as the user makes their selection on the theater map.
* **Hyper-Modern "Linear" Aesthetic:** Mesh-gradient dark mode canvas, high-contrast neon borders, and precise opacity control to mimic modern flagship tech products.

---

## 🛠️ Project Structure
```bash
movie-booking-system/
│
├── index.html       # Landing Page (Hero, Marquee Ticker, Movies)
├── login.html       # Authentication Portal
├── booking.html     # Ticket Reservation Matrix & Checkout Engine
├── team.html        # Academic Developers & Project Mentor Directory
│
├── style.css        # Global Stylesheet (Variables, Glassmorphism, Animations)
└── script.js        # Core DOM Engine (Pricing, Canvas, Firebase, EmailJS)
```

---

## 👨‍💻 Meet The Architects

Designed and Developed by:
* **Sanjay J** — Developer
* **JAIVARSHAN V** — Developer
* **Jani Rose Lawwellman** — Developer
* **Dr. Baiju BV** — Project Mentor

> *This project was built for academic defense purposes. Custom API keys for Firebase and EmailJS are initialized natively via their respective initialization environments.*
