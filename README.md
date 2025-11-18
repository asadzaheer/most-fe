# Queue Management System - Frontend

A modern, multilingual queue management application built with React, TypeScript, and Vite. This system allows users to register, join queues, and manage their tickets with real-time updates.

## 🚀 Tech Stack

### Core
- **React 18.3** - Latest version with concurrent features
- **TypeScript 5.5** - Type-safe JavaScript
- **Vite 5.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

### State Management & Data Fetching
- **Zustand 4.5** - Lightweight state management for authentication
- **React Query (TanStack Query) 5.90** - Server state management and caching
- **Axios 1.6** - HTTP client with interceptors

### Routing & UI
- **React Router 6.26** - Client-side routing
- **Radix UI** - Accessible component primitives (Toast, Tooltip)
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **class-variance-authority** - Component variants management

### Internationalization
- **i18next 23.11** - Internationalization framework
- **react-i18next 14.1** - React bindings for i18next
- **i18next-browser-languagedetector** - Automatic language detection

### Supported Languages
- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)
- 🇪🇪 Estonian (ee)

## ✨ Features

### Authentication
- **User Registration** - Multi-step registration with phone verification
- **Login System** - Secure login with JWT tokens
- **Session Management** - Persistent authentication with Zustand store
- **Phone Verification** - SMS code verification system

### Queue Management
- **Join Queue** - Take a place in the queue with one click
- **Ticket Status** - Real-time ticket status (WAITING, ACTIVE, COMPLETED, CANCELLED)
- **Complete Service** - Mark your visit as complete
- **Exit Queue** - Leave the queue permanently
- **Queue Number Display** - Visual queue position indicator

### User Interface
- **Multilingual Support** - Switch between English, Russian, and Estonian
- **Responsive Design** - Mobile-first, works on all devices
- **Dark/Light Mode** - Theme switching support
- **Toast Notifications** - User-friendly feedback messages

### Navigation
- **Home** - Main dashboard with queue actions
- **FAQ** - Frequently asked questions modal
- **Logout** - Secure session termination

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example file
copy .env.example .env

# Edit .env and set your backend API URL
# VITE_API_BASE_URL=http://localhost:8080/api
```

4. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173` with hot module replacement (HMR) enabled.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (includes TypeScript type checking)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8080/api
```

**Important**: The `VITE_` prefix is required for Vite to expose the variable to the client.

## 🏗️ Build & Deployment

### Build for Production

```bash
npm run build
```

This will:
1. Run TypeScript compiler to check types
2. Build optimized production bundle in `dist/` folder
3. Minify and optimize all assets

### Preview Production Build

```bash
npm run preview
```

**Quick Deployment Steps:**
1. Build the application: `npm run build`
2. Upload contents of `dist/` folder to your web server
3. Ensure `.htaccess` is in the root for proper React Router support
4. Update `VITE_API_BASE_URL` in `.env` to point to production API

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components (Button, Toast, etc.)
│   │   ├── AuthModal.tsx        # Authentication modal (Login/Registration tabs)
│   │   ├── Login.tsx            # Login form component
│   │   ├── Registration.tsx     # Multi-step registration component
│   │   ├── Navbar.tsx           # Navigation bar with language switcher
│   │   ├── Layout.tsx           # Page layout wrapper
│   │   ├── QueueNumberCard.tsx  # Queue position display
│   │   ├── InfoCard.tsx         # Information card component
│   │   └── FAQModal.tsx         # FAQ modal component
│   ├── pages/                   # Page components
│   │   ├── Index.tsx            # Home page (main queue interface)
│   │   └── NotFound.tsx         # 404 error page
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-api.ts           # React Query hooks for API calls
│   │   └── use-toast.ts         # Toast notification hook
│   ├── lib/                     # Utility libraries
│   │   ├── api-client.ts        # Axios client with JWT interceptors
│   │   ├── api-config.ts        # API endpoint definitions
│   │   ├── api-service.ts       # Typed API service functions
│   │   └── utils.ts             # Utility functions
│   ├── store/                   # Zustand state management
│   │   ├── useAuthStore.ts      # Authentication store
│   │   └── index.ts             # Store exports and initialization
│   ├── i18n/                    # Internationalization
│   │   ├── config.ts            # i18next configuration
│   │   └── locales/             # Translation files
│   │       ├── en.json          # English translations
│   │       ├── ru.json          # Russian translations
│   │       └── ee.json          # Estonian translations
│   ├── App.tsx                  # Main App component with routing
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles with Tailwind directives
│   └── vite-env.d.ts            # Vite environment type definitions
├── .env.example                 # Environment variables template
├── .htaccess                    # Apache configuration for React Router
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies and scripts
├── README.md                    # This file
├── DEPLOYMENT_GUIDE.md          # Deployment instructions
├── DEPLOYMENT_CHECKLIST.md      # Pre-deployment checklist
└── I18N_USAGE_GUIDE.md          # Internationalization guide
```

## 🔐 Authentication Flow

1. **User clicks "TAKE PLACE"** → AuthModal opens with Login tab
2. **Login** → User enters phone and password → JWT token stored in Zustand store
3. **Registration** → Multi-step process:
   - Step 1: Name and birth date
   - Step 2: Phone number
   - Step 3: Password creation → API sign-up call
   - Step 4: SMS verification code → API verify-code call
4. **Token Management** → Axios interceptor automatically adds token to all API requests
5. **Session Persistence** → Auth state persists in localStorage via Zustand

## 🎫 Ticket Management Flow

1. **Join Queue** → Click "TAKE PLACE" → POST `/api/tickets` → Ticket created with WAITING status
2. **View Position** → Queue number card shows current position
3. **Complete Service** → Click "Complete" → PATCH `/api/tickets` with COMPLETED status
4. **Exit Queue** → Click "Exit" → DELETE `/api/tickets` → Ticket removed

## 🌍 Internationalization

The application supports 3 languages with automatic detection based on browser settings. Users can switch languages using the dropdown in the navbar.

For detailed i18n usage and adding new translations, see:
- **[I18N_USAGE_GUIDE.md](./I18N_USAGE_GUIDE.md)**

### Adding New Translations

1. Add translation keys to all locale files:
   - `src/i18n/locales/en.json`
   - `src/i18n/locales/ru.json`
   - `src/i18n/locales/ee.json`

2. Use in components:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('myKey')}</h1>;
}
```

## 🔌 API Integration

The application connects to a Java backend at `http://localhost:8080/api` (configurable via `.env`).

### API Endpoints

**Authentication:**
- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login

**Verification:**
- `POST /verify/get-code` - Request SMS verification code
- `POST /verify/verify-code` - Verify SMS code

**Tickets:**
- `POST /tickets` - Create new ticket (join queue)
- `PATCH /tickets` - Update ticket status
- `DELETE /tickets` - Delete ticket (exit queue)

### API Client Features

- **Automatic JWT Token Injection** - Token added to all requests via interceptor
- **Error Handling** - Automatic 401 handling with logout
- **Request/Response Interceptors** - Logging and error transformation
- **TypeScript Types** - Fully typed requests and responses
- **React Query Integration** - Caching, refetching, and optimistic updates

## 🧪 Testing

Currently, the application does not have automated tests. Consider adding:
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Build to verify: `npm run build`
5. Submit a pull request

## 📝 Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Configured with React and TypeScript rules
- **Prettier** - (Optional) Add for consistent formatting
- **Component Structure** - Functional components with hooks
- **State Management** - Zustand for global state, React Query for server state

## 🐛 Troubleshooting

### Development Server Won't Start
- Check if port 5173 is already in use
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

### API Calls Failing
- Verify `VITE_API_BASE_URL` in `.env` is correct
- Check if backend server is running
- Check browser console for CORS errors
- Verify JWT token is present in localStorage

### Build Errors
- Run `npm run lint` to check for code issues
- Ensure all TypeScript errors are resolved
- Check for missing dependencies: `npm install`

### Translation Not Working
- Verify translation keys exist in all locale files (en.json, ru.json, ee.json)
- Check browser console for i18next errors
- Clear localStorage and refresh page

## 📄 License

MIT

## 📞 Support

For issues and questions:
1. Check existing documentation (DEPLOYMENT_GUIDE.md, I18N_USAGE_GUIDE.md)
2. Review browser console for errors
3. Check network tab for API call failures
4. Contact development team

---

**Built with ❤️ using React, TypeScript, and Vite**
