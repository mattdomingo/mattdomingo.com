# Matt Domingo Portfolio

A Minecraft-themed portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🎮 Features

- **Minecraft-inspired design** with custom textures and fonts
- **Responsive layout** that works on all devices
- **Project showcase** with GitHub integration
- **Skills inventory** with interactive filtering
- **Optimized performance** with Next.js 15

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open [http://localhost:3000](http://localhost:3000)** to view the site

## 📁 Project Structure

```
mattdomingo.com/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page with skills
│   ├── contact/           # Contact information
│   ├── projects/          # Projects showcase
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── minecraft-navbar.tsx
│   └── skills-inventory.tsx
├── lib/                   # Utility functions
├── public/                # Static assets
│   ├── fonts/            # Minecraft font
│   ├── textures/         # Background textures
│   └── projects/         # Project images
└── Configuration files...
```

## 🎨 Customization

- **Add project images:** Place images in `public/projects/`
- **Update projects:** Edit the projects array in `app/projects/page.tsx`
- **Modify textures:** Replace files in `public/textures/`
- **Update skills:** Modify the skills data in `components/skills-inventory.tsx`

## 🛠️ Built With

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Font:** Custom Minecraft font
- **Deployment:** Vercel (recommended)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
