# Meeting Scheduler Frontend

A React-based web application for managing meeting schedules with separate interfaces for organizers and participants. This frontend provides an intuitive user interface for creating, viewing, and managing meetings with real-time validation and role-based dashboards.

## What This Project Does

This frontend application provides:
- **User Authentication**: Login and registration interface with secure credential handling
- **Organizer Dashboard**: Interface for creating, editing, and deleting meetings with participant assignment
- **Participant Dashboard**: View all assigned meetings with schedule details
- **Meeting Management**: Create meetings with title, description, date, time range, and participant selection
- **Conflict Prevention**: Real-time feedback when meeting times conflict with existing schedules
- **Role-Based Views**: Different interfaces based on user role (ORGANIZER or PARTICIPANT)
- **Session Management**: Automatic token refresh and secure logout functionality

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite (fast development and optimized production builds)
- **State Management**: Zustand (lightweight state management)
- **Routing**: React Router DOM
- **HTTP Client**: Axios (API communication)
- **Styling**: CSS

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ProtectedRoute.tsx    # Authentication guard
│   │   └── RoleBasedRoute.tsx    # Role-based routing
│   ├── pages/              # Main page components
│   │   ├── Login.tsx             # Login page
│   │   ├── Register.tsx          # Registration page
│   │   ├── OrganizerDashboard.tsx   # Organizer interface
│   │   └── ParticipantDashboard.tsx # Participant interface
│   ├── services/           # API integration
│   │   └── api.ts               # Axios configuration and API calls
│   ├── store/              # State management
│   │   └── authStore.ts         # User authentication state
│   ├── types/              # TypeScript definitions
│   │   └── index.ts             # Shared type definitions
│   ├── utils/              # Helper functions
│   │   └── storage.ts           # localStorage utilities
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
└── package.json
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=your_backend_api_url
```

## User Roles

### ORGANIZER
- Create new meetings with title, description, date, and time range
- Edit or delete existing meetings
- Assign participants to meetings
- Remove participants from meetings
- View all meetings they've created

### PARTICIPANT
- View all meetings they are assigned to
- See meeting details (title, description, time, organizer)
- Read-only access (cannot create or modify meetings)

## Key Features

### Authentication Flow
1. User registers with name, email, password, and role selection
2. User logs in with email and password
3. JWT tokens stored in localStorage for session persistence
4. Automatic token refresh when access token expires
5. Protected routes redirect to login if not authenticated

### Meeting Creation (Organizer)
1. Fill in meeting details (title, description, date, time range)
2. Select participants from a list of users
3. System validates for conflicts before creating
4. Meeting appears in organizer's dashboard

### Meeting Viewing (Participant)
1. All assigned meetings displayed in dashboard
2. Shows meeting title, description, date, time range, and organizer
3. Automatically updates when assigned to new meetings

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create `.env` file with backend API URL

3. **Development mode**:
   ```bash
   npm run dev
   ```

4. **Production build**:
   ```bash
   npm run build
   npm run preview  # Preview production build locally
   ```

## API Integration

The frontend communicates with the backend API using Axios:
- Base URL configured via `VITE_API_BASE_URL` environment variable
- JWT token automatically included in request headers
- Automatic token refresh on 401 responses
- Error handling with user-friendly messages

## Styling

- Custom CSS with consistent color scheme
- Responsive design for desktop and mobile devices
- Clean, modern interface with card-based layouts
- Form validation with inline error messages

## Related Repositories

- **Backend**: [Meeting-Scheduling-Management-System-Backend](https://github.com/ashmitha2304/Meeting-Scheduling-Management-System-Backend)
- **Complete Project**: [Meeting-Scheduling-Management-System](https://github.com/ashmitha2304/Meeting-Scheduling-Management-System)

