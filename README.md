# Matt Domingo Portfolio

A Minecraft-themed portfolio website built with Next.js, TypeScript, and Tailwind CSS featuring smooth page transitions and a functional contact form.

## 🎮 Features

- **Minecraft-inspired design** with custom textures and fonts
- **Smooth page transitions** using Framer Motion
- **Functional contact form** with EmailJS integration
- **Responsive layout** that works on all devices
- **Project showcase** with GitHub integration
- **Skills inventory** with interactive filtering
- **Resume viewer** with PDF display
- **Optimized performance** with Next.js 15

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```bash
# EmailJS Configuration (required for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open the displayed URL** (usually [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001)) to view the site

## 📁 Project Structure

```
mattdomingo.com/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page with skills
│   ├── contact/           # Contact form with EmailJS
│   ├── projects/          # Projects showcase
│   ├── resume/            # Resume viewer
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── minecraft-navbar.tsx
│   ├── skills-inventory.tsx
│   └── page-transition.tsx
├── lib/                   # Utility functions
├── public/                # Static assets
│   ├── fonts/            # Minecraft font
│   ├── textures/         # Background textures
│   ├── projects/         # Project images
│   └── documents/        # Resume PDF
└── Configuration files...
```

## 🎨 Customization

- **Add project images:** Place images in `public/projects/`
- **Update projects:** Edit the projects array in `app/projects/page.tsx`
- **Modify textures:** Replace files in `public/textures/`
- **Update skills:** Modify the skills data in `components/skills-inventory.tsx`
- **Contact form:** Set up EmailJS account and update environment variables

## 📧 Contact Form Setup

The contact form uses EmailJS for email delivery:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Add your credentials to `.env.local`
4. The form will automatically work with your configuration

## 🛠️ Built With

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Email Service:** EmailJS
- **Font:** Custom Minecraft font
- **Deployment:** Vercel (recommended)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
