# Meeting Scheduling Management System - Frontend

## Project Overview

The Meeting Scheduling Management System is a full-stack web application designed to manage meetings with strict role-based access control and conflict detection. The system allows organizers to create and manage meetings while participants can view only the meetings they are assigned to.

A critical business rule is enforced at the database level: a participant cannot be scheduled for overlapping meetings. Any attempt to create or update a meeting that violates this rule is rejected.

The system uses persistent database storage, secure JWT-based authentication, and role-based authorization to ensure correctness, security, and reliability.

## Tech Stack

**Frontend**

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

Role-based access control is enforced on both backend APIs and frontend routes.

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

A meeting is considered conflicting if:

```
existing.startTime < newMeeting.endTime
AND
existing.endTime > newMeeting.startTime
```

## Related Repositories

- Backend: https://github.com/ashmitha2304/Meeting-Scheduling-Management-System-Backend
- Complete Project: https://github.com/ashmitha2304/Meeting-Scheduling-Management-System
