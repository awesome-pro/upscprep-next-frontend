# UPSCprep Frontend 🎯

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**A modern, enterprise-grade learning management system for UPSC exam preparation**

- [🚀 Live Demo](https://upscprep.abhinandan.pro) 
-  🐛 Report Bug](https://github.com/awesome-pro/upscprep-next-frontend/issues)
-   [💡 Request Feature](https://github.com/awesome-pro/upscprep-next-frontend/issues)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

UPSCprep is a comprehensive, full-stack learning management system specifically designed for Union Public Service Commission (UPSC) exam aspirants in India. This repository contains the frontend application built with modern web technologies, offering a seamless and engaging user experience.

### 🌟 Why UPSCprep?

- **Real-time Excellence**: WebSocket-powered mock tests with synchronised timers
- **Security First**: JWT-based authentication with role-based access control
- **Modern Architecture**: Built on Next.js 15 with React Server Components
- **Scalable Design**: Feature-driven architecture ready for enterprise scale

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based Authentication** - Stateless, secure user sessions
- **Role-Based Access Control** - Dynamic UI adaptation for different user roles (Student, Teacher & Admin)
- **Protected Routes** - Secure access to premium content

### 🧪 Real-Time Mock Tests
- **WebSocket Integration** - Live, synchronized exam experience
- **Server-Side Timing** - Tamper-proof test sessions
- **Instant Feedback** - Real-time response submission and validation

### 💳 Payment Integration
- **Razorpay Integration** - Secure subscription management
- **Multiple Payment Methods** - Cards, UPI, net banking support
- **Subscription Tracking** - Automated renewal and billing management

### 📁 Document Management
- **AWS S3 Integration** - Scalable file storage and retrieval
- **Secure Uploads** - Protected document handling
- **Study Material Library** - Organized resource management

### 📊 Analytics Dashboard
- **Progress Tracking** - Comprehensive performance metrics
- **Test Analytics** - Detailed score analysis and improvement suggestions
- **Study Statistics** - Time management and learning insights

## 🛠️ Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router |
| **React** | 19.x | Front-end ibrary with modern hooks |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |

### UI & Design
| Technology | Purpose |
|------------|---------|
| **Shadcn/ui** | Headless, accessible components |
| **Lucide Icons** | Modern icon system |
| **Framer Motion** | Smooth animations and transitions |

### Development & Build Tools
| Technology | Purpose |
|------------|---------|
| **pnpm** | Fast, efficient package manager |
| **ESLint** | Code linting and formatting |
| **Prettier** | Code style consistency |

### Integration & Services
| Service | Purpose |
|---------|---------|
| **WebSocket** | Real-time communication |
| **Razorpay** | Payment processing |
| **AWS S3** | File storage |
| **JWT** | Authentication tokens |

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22.17.0 or later) - [Download here](https://nodejs.org/)
- **pnpm** (v10.15.0 or later) - [Installation guide](https://pnpm.io/installation)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/awesome-pro/upscprep-next-frontend.git
   cd upscprep-next-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration values (see [Environment Variables](#environment-variables))

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup (Optional)

For containerized development:

```bash
# Build the image
docker build -t upscprep-frontend .

# Run the container
docker run -p 3000:3000 upscprep-frontend
```

## 📁 Project Structure

```
upscprep-frontend/
├── 📁 app/                    # Next.js App Router (routes & pages)
│   ├── 📁 (auth)/            # Authentication routes
│   ├── 📁 dashboard/         # Dashboard pages
│   ├── 📁 tests/             # Test-related pages
│   └── 📁 api/               # API routes
├── 📁 components/            # Reusable UI components
│   ├── 📁 ui/                # Shadcn/ui components
│   ├── 📁 forms/             # Form components
│   └── 📁 layouts/           # Layout components
├── 📁 contexts/              # React Context providers
├── 📁 hooks/                 # Custom React hooks
├── 📁 lib/                   # Utility functions & configs
├── 📁 providers/             # App-level providers
├── 📁 services/              # API service layer
├── 📁 stores/                # State management
├── 📁 types/                 # TypeScript type definitions
├── 📁 public/                # Static assets
├── 📁 styles/                # Global styles
└── 📄 package.json           # Dependencies & scripts
```

### Key Directories Explained

- **`app/`**: Contains all application routes using Next.js 15 App Router
- **`components/`**: Reusable UI components following atomic design principles
- **`services/`**: API abstraction layer for clean data fetching
- **`hooks/`**: Custom React hooks for shared logic
- **`lib/`**: Utility functions, helpers, and third-party configurations

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# AWS S3 Configuration (if handling client-side uploads)
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_S3_BUCKET_NAME=your_s3_bucket

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=UPSCprep

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm format` | Format code with Prettier |

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Docker Production

```bash
# Build production image
docker build -t upscprep-frontend:prod .

# Run production container
docker run -p 3000:3000 upscprep-frontend:prod
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

---

<div align="center">

**Built with ❤️ by the UPSCprep Team**

[Website](https://your-upsc-prep-url.com) • [GitHub](https://github.com/awesome-pro/upscprep-frontend) • [Issues](https://github.com/awesome-pro/upscprep-frontend/issues)

</div>
