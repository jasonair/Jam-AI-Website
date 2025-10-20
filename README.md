# Jam AI Landing Page

A modern, responsive landing page for Jam AI built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, clean design with dark mode support
- 📱 Fully responsive across all devices
- ⚡ Built with Next.js 14 App Router
- 🎭 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🚀 Optimized for Vercel deployment
- ♿ Accessible and semantic HTML
- 🔒 Privacy-focused design

## Project Structure

```
├── app/
│   ├── page.tsx           # Home page
│   ├── account/           # Account dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   └── sections/          # Page sections
│       ├── Hero.tsx
│       ├── Value.tsx
│       ├── HowItWorks.tsx
│       ├── Team.tsx
│       ├── Pricing.tsx
│       ├── FAQ.tsx
│       ├── Trust.tsx
│       ├── CTA.tsx
│       └── Footer.tsx
├── lib/
│   └── utils.ts           # Utility functions
└── public/                # Static assets

```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

Alternatively, use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Environment Variables

For production deployment, you may need to configure:

- Firebase configuration (for authentication)
- Stripe API keys (for payments)
- Analytics tracking IDs

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_key
```

## Pages

### Home (`/`)
Complete landing page with all sections:
- Hero with animated visual
- Value proposition (4 key benefits)
- How It Works (3-step process)
- AI Team showcase
- Pricing plans (Free, Trial, Premium, Pro)
- FAQ accordion
- Trust & social proof
- Call-to-action
- Footer with links

### Account Dashboard (`/account`)
User account management page featuring:
- Current plan overview
- Credits usage tracking
- AI team member slots
- Billing management (Stripe integration ready)
- Usage statistics
- Theme preferences (Light/Dark/System)
- Data & privacy controls

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel-ready
- **Future integrations:** Firebase Auth, Stripe Payments

## Design Philosophy

- **Calm & Clever:** Professional yet approachable tone
- **Visual Hierarchy:** Clear information architecture
- **Accessibility:** WCAG compliant, keyboard navigable
- **Performance:** Optimized images, code splitting
- **Mobile-First:** Responsive design from the ground up

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  accent: {
    DEFAULT: '#3B82F6', // Primary blue
    hover: '#2563EB',   // Darker blue
  },
}
```

### Content

All content is stored in the component files. Update text directly in:
- `components/sections/*.tsx` for landing page content
- `app/account/page.tsx` for dashboard content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 Jam AI. All rights reserved.

## Support

For questions or issues, contact support or visit our documentation.
