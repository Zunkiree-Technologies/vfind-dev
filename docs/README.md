# V-Find Documentation

Welcome to the V-Find project documentation. This documentation provides comprehensive information about the V-Find healthcare job matching platform.

## Documentation Index

### Core Documentation

| Document | Description |
|----------|-------------|
| [Project Overview](./PROJECT_OVERVIEW.md) | High-level project summary, goals, and vision |
| [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) | System architecture, tech stack, and design patterns |
| [User Stories](./USER_STORIES.md) | User personas, journeys, and feature requirements |
| [API Documentation](./API_DOCUMENTATION.md) | Backend API endpoints and integration guide |
| [Component Guide](./COMPONENT_GUIDE.md) | UI component library and usage patterns |
| [Deployment Guide](./DEPLOYMENT_GUIDE.md) | Deployment procedures and environment setup |

### Quick Links

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Commands](#development-commands)
- [Contributing](#contributing)

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vfind-dev

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables (see Deployment Guide)

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Project Structure

```
vfind-dev/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── Admin/           # Admin dashboard
│   │   ├── EmployerDashboard/ # Employer portal
│   │   ├── nurseProfile/    # Nurse portal
│   │   ├── signup/          # Multi-step registration
│   │   └── ...              # Other pages
│   ├── components/          # Reusable UI components
│   │   └── ui/              # Shadcn/ui components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── utils/               # Helper functions
│   └── middleware.ts        # Route protection
├── components/              # Root-level landing components
├── public/                  # Static assets
├── docs/                    # This documentation
└── ...                      # Config files
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Tech Stack Summary

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.4.4 |
| UI Library | React 19.1.0 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | Radix UI + Shadcn/ui |
| Forms | React Hook Form + Zod |
| Rich Text | TipTap |
| HTTP Client | Axios |
| Auth | NextAuth v4 + Cookies |
| Backend | Xano (BaaS) |

---

## Contributing

1. Review the [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) document
2. Follow the existing code patterns and conventions
3. Write tests for new features
4. Update documentation as needed
5. Submit pull requests for review

---

## Support

For questions or issues:
- Review the documentation in this folder
- Check existing issues in the repository
- Contact the development team

---

**Last Updated:** December 2025
**Version:** 0.1.0
