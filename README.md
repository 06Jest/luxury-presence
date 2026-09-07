# Marci Metzger — The Ridge Realty Group

A premium, interactive redesign of the Marci Metzger / The Ridge Realty Group homepage, created as a Junior Web Builder application project for Luxury Presence.

The project reimagines the original homepage with a more editorial, immersive real-estate experience while preserving the original business content and imagery.

## Live Demo

(Production:](https://luxury-presence-nine.vercel.app/)

## Overview

The goal of this project was to redesign the homepage of [marcimetzger.com](https://marcimetzger.com/) into a modern, premium real-estate experience.

The design focuses on one central idea:

> You're not just buying a house. You're choosing the place where your life is going to happen.

Rather than making the website feel like a traditional real-estate listing portal, the experience puts the home buyer at the center and positions Marci as the guide throughout the buying and selling process.

## Features

* Premium editorial real-estate homepage
* Responsive navigation with section anchors
* Cinematic hero section
* Interactive 3D exterior house built with Three.js
* Dynamic weather sequence with:

  * Rain
  * Thunderstorm
  * Lightning
  * Sunny weather
  * Wind-reactive tree
* Property search interface
* Buyer and seller-focused content
* Track record and animated statistics
* Interactive property photography gallery
* Image lightbox
* Scroll-based animations and transitions
* Testimonials marquee
* Responsive mobile experience
* Reduced-motion accessibility support
* AI-powered Marci assistant
* Marci-specific AI knowledge base
* AI guardrails to prevent unsupported claims
* Five-question visitor limit
* Liquid-glass chatbot interface

## AI Assistant

The homepage includes an AI-powered assistant designed to help visitors learn more about Marci Metzger and The Ridge Realty Group.

### Architecture

```text
Visitor
   ↓
ChatBox
   ↓
Next.js API Route
   ↓
Google Gemini
   ↓
System Instructions
   ↓
Marci Knowledge Base
   ↓
AI Response
```

The assistant is intentionally restricted to information contained in the project's Marci knowledge base.

It is instructed to:

* Answer questions about Marci and her real-estate services
* Use only verified project information
* Avoid inventing listings, prices, clients, awards, certifications, or credentials
* Avoid providing legal, tax, mortgage, financial, or investment advice
* Identify itself as Marci's AI assistant rather than pretending to be Marci
* Redirect unrelated questions toward relevant real-estate topics
* Suggest contacting Marci when information is unavailable

The Gemini API key is stored as an environment variable and is never committed to the repository.

## Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* GSAP
* Lenis
* Three.js
* React Three Fiber
* React Three Drei
* Next/Image

### AI

* Google Gemini API
* `@google/genai`

### Tooling

* ESLint
* Git
* GitHub
* Vercel

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   ├── motion/
│   └── sections/
│
└── lib/
    ├── marciKnowledge.ts
    └── site.ts

public/
└── images/
```

## Key Components

### Hero

The hero combines the real-estate message with an interactive 3D exterior house.

The house transitions through different weather conditions to create a memorable visual signature while keeping the experience relevant to the idea of finding a place to call home.

### Property Search

A focused property search interface allows visitors to enter:

* Location
* Property type
* Bedrooms
* Bathrooms
* Minimum price
* Maximum price
* Sort order

The interface is intentionally presented as a visual search experience rather than pretending to provide live listing data where no listing API is connected.

### Gallery

The photography gallery uses an interactive featured-image presentation with:

* Image transitions
* Filmstrip navigation
* Previous/next controls
* Pointer interaction
* Keyboard navigation
* Lightbox viewing
* Scroll-based motion
* Reduced-motion support

### Testimonials

The testimonial section uses a continuous horizontal marquee designed to create movement without interrupting the page's overall editorial feel.

Placeholder testimonials are clearly marked in the source and should be replaced with verified client testimonials before production use.

## Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env.local` or expose the API key in client-side code.

For production deployment, configure `GEMINI_API_KEY` through the hosting provider's environment-variable settings.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Run lint

```bash
npm run lint
```

### Create a production build

```bash
npm run build
```

### Run the production server

```bash
npm start
```

## Deployment

The project is designed to be deployed on Vercel.

After importing the GitHub repository into Vercel, add:

```text
GEMINI_API_KEY
```

to the project's environment variables before deploying.

## Design Direction

The visual direction combines:

* Warm desert-inspired neutrals
* Editorial typography
* Large-scale photography
* Generous whitespace
* Subtle motion
* Sophisticated transitions
* Minimal UI chrome
* Architectural visual language

The design intentionally avoids excessive gradients, heavy card layouts, excessive rounded elements, and overly futuristic visual effects.

The goal is to make the website feel like a premium real-estate brand rather than a generic SaaS landing page.

## Accessibility & Performance

The project includes several accessibility and performance considerations:

* Responsive layouts
* Keyboard-accessible interactive elements
* Reduced-motion support
* Semantic HTML
* Optimized images through `next/image`
* Client-side interaction only where necessary
* No unnecessary scroll hijacking
* Lightweight animation patterns
* Server-side handling of the Gemini API key

## Credits

Original business content and photography:

**Marci Metzger — The Ridge Realty Group**

3190 HW-160 Suite F
Pahrump, NV 89048
United States

Phone: (206) 919-6886

The redesign was created as part of a Junior Web Builder application project for Luxury Presence.

## License

This project was created for an application/portfolio demonstration.

Original business content, branding, and photography belong to their respective owners.
