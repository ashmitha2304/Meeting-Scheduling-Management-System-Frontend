# Meeting Scheduling Management System - Frontend

## Project Overview

Meeting scheduling system with role-based access control and conflict detection. Organizers create and manage meetings. Participants view assigned meetings. Database enforces no overlapping meetings for participants.

## Tech Stack

- React
- Vite
- TypeScript
- Axios
- React Router DOM
- Zustand

## User Roles and Permissions

**ORGANIZER**

- Register and log in
- Create meetings with date and time range
- Update or delete meetings they created
- Assign and remove participants from meetings
- View all meetings they created

**PARTICIPANT**

- Register and log in
- View meetings they are assigned to
- View meeting details
- Cannot create, update, or delete meetings

## Database Schema

**User Schema**

```
{
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: "ORGANIZER" | "PARTICIPANT",
  createdAt: Date,
  updatedAt: Date
}
```

**Meeting Schema**

```
{
  title: String,
  description: String,
  organizer: ObjectId (ref User),
  participants: [ObjectId] (ref User, indexed),
  startTime: Date (indexed),
  endTime: Date (indexed),
  status: "SCHEDULED" | "CANCELLED",
  createdAt: Date,
  updatedAt: Date
}
```

## Conflict Detection Rule

```
existing.startTime < newMeeting.endTime AND existing.endTime > newMeeting.startTime
```

## Live Deployment

Frontend App: https://meeting-scheduling-management-system-frontend.vercel.app

## Related Repositories

- Backend: https://github.com/ashmitha2304/Meeting-Scheduling-Management-System-Backend
- Complete Project: https://github.com/ashmitha2304/Meeting-Scheduling-Management-System
