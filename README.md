# Meeting Scheduler Frontend

Modern React + TypeScript frontend for the Meeting Scheduling Management System with role-based dashboards.

## 🚀 Features

- ✅ User Authentication (Login/Register)
- ✅ Role-Based Dashboards (ORGANIZER/PARTICIPANT)
- ✅ Meeting Management (Create, Edit, Delete)
- ✅ Participant Assignment
- ✅ Schedule Viewing
- ✅ Responsive Design
- ✅ State Management with Zustand
- ✅ Type-Safe with TypeScript

## 🏗️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleBasedRoute.tsx
│   ├── pages/          # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── OrganizerDashboard.tsx
│   │   └── ParticipantDashboard.tsx
│   ├── services/       # API services
│   │   └── api.ts
│   ├── store/          # Zustand stores
│   │   └── authStore.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── storage.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

For local development:
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 🎨 User Roles

### ORGANIZER Dashboard
- Create new meetings
- View all created meetings
- Edit meeting details
- Assign/remove participants
- Cancel meetings
- Delete meetings

### PARTICIPANT Dashboard
- View assigned meetings
- View meeting details
- See schedule

## 🌐 Deployment on Vercel

### Prerequisites
- Backend deployed and running
- GitHub repository created

### Deployment Steps

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import Project
   - Select this repository

2. **Configure Project**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

### Verify Deployment

Visit your deployed URL and test:
- Registration
- Login
- Dashboard access
- Meeting operations

## 🔐 Authentication Flow

1. User registers or logs in
2. Receives JWT access token and refresh token
3. Tokens stored in localStorage
4. Access token sent in Authorization header
5. Automatic token refresh on expiry
6. Protected routes check authentication

## 📱 Pages

### Public Routes
- `/` - Login page
- `/register` - Registration page

### Protected Routes (Require Authentication)
- `/organizer/dashboard` - Organizer dashboard (ORGANIZER role only)
- `/participant/dashboard` - Participant dashboard (PARTICIPANT role only)

## 🎯 API Integration

The frontend communicates with the backend API:

```typescript
// Example API call
import api from './services/api';

// Get user's meetings
const response = await api.get('/meetings');
const meetings = response.data;

// Create a meeting (ORGANIZER only)
const newMeeting = await api.post('/meetings', {
  title: 'Team Standup',
  participantIds: ['user1', 'user2'],
  startTime: '2026-02-01T10:00:00Z',
  endTime: '2026-02-01T11:00:00Z'
});
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Organization

- **Components**: Reusable UI components
- **Pages**: Full page components
- **Services**: API communication layer
- **Store**: State management with Zustand
- **Types**: TypeScript type definitions
- **Utils**: Helper functions

## 🎨 Styling

The app uses custom CSS with:
- Responsive design
- Modern UI components
- Role-based color coding
- Clean and intuitive layout

## 👤 Author

**Ashmitha** ([@ashmitha2304](https://github.com/ashmitha2304))

## 📄 License

MIT

## 🔗 Links

- **Backend Repository**: https://github.com/ashmitha2304/Meeting-Scheduling-Management-System-Backend
- **Complete Project**: https://github.com/ashmitha2304/Meeting-Scheduling-Management-System

## 🆘 Support

For issues or questions, please open an issue on GitHub.
