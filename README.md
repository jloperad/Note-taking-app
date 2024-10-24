# Note Taking App

This is a full-stack note-taking application built with Next.js for the frontend and Nest.js for the backend. The app allows users to create, edit, delete, archive, and filter notes.

## Technologies Used

- **Frontend**: Next.js 15, TailwindCSS, TypeScript
- **Backend**: Nest.js 10, Prisma ORM, PostgreSQL
- **Database**: Supabase (PostgreSQL)

## Prerequisites

- Node.js v18.17
- npm v9.6.7
- PostgreSQL
- Supabase account for database hosting

## Project Structure

- `frontend`: Contains the Next.js application.
- `backend`: Contains the Nest.js application.

## Setup Instructions

### Clone the Repository

```bash
git clone <your-private-repo-url>
cd <your-repo-name>
```

### Environment Configuration

1. **Backend**: Create a `.env` file in the `backend` directory with the following structure:

    ```
    DATABASE_URL="your_supabase_connection_string_with_pgbouncer"
    DIRECT_URL="your_direct_supabase_connection_string"
    ```

   Replace the placeholders with your actual Supabase connection strings.

2. **Frontend**: No additional environment configuration is required.

### Installation

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### Running the Application

A script is provided to set up and run both the frontend and backend applications.

```bash
./run.sh
```

This script will:

- Install dependencies for both frontend and backend.
- Apply database migrations.
- Generate the Prisma client.
- Start the Nest.js server on port 3001.
- Start the Next.js development server on port 3000.

### Accessing the Application

- Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the frontend.
- The backend API is accessible at [http://localhost:3001/api](http://localhost:3001/api).

## API Endpoints

- `GET /api/notes/active` - Retrieve all active notes.
- `GET /api/notes/archived` - Retrieve all archived notes.
- `GET /api/notes/:id` - Retrieve a note by ID.
- `POST /api/notes` - Create a new note.
- `PUT /api/notes/:id` - Update a note by ID.
- `DELETE /api/notes/:id` - Delete a note by ID.
- `PUT /api/notes/:id/archive` - Toggle archive status of a note by ID.

e.
