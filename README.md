# React TypeScript Todo Application

A modern Todo application built with React, TypeScript, and Redux to efficiently manage your daily tasks.

## Features

- View all todo items
- Add new tasks
- Edit existing tasks
- Toggle task status (Pending/Completed)
- Delete tasks
- Responsive design for all devices

## Technologies

- React 18
- TypeScript 4.9+
- Redux Toolkit
- Tailwind CSS
- RESTful API integration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running backend API server (Flask)

## Frontend Project Structure

```
src/
├── api/
│   └── todoApi.ts         # API integration functions
├── components/
│   ├── TodoForm.tsx       # Form for adding new tasks
│   ├── TodoItem.tsx       # Individual todo item component
│   └── TodoList.tsx       # List of all todo items
├── store/
│   ├── todoSlice.ts       # Redux slice for todos
│   └── store.ts           # Redux store configuration
├── types/
│   └── types.ts           # TypeScript interfaces
├── App.tsx                # Main application component
├── index.tsx              # Entry point
└── index.css              # Global styles
```

## Backend
Python + Flask

## API Endpoints

The application interacts with the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /todos   | Fetch all todos |
| POST   | /todos   | Create a new todo |
| PUT    | /todos/:id | Update an existing todo |
| DELETE | /todos/:id | Delete a todo |

## Google Big Query DB Data Model

```typescript
interface Todo {
  id: string;        // UUID format
  task: string;      // Task description
  status: "Pending" | "Completed";  // Task status
}
```
