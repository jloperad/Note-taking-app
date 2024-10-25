# Note Taking App

This is a full-stack note-taking application built with Next.js for the frontend and Nest.js for the backend. The app provides a comprehensive set of features for managing notes:

- Create, edit, and delete notes with a user-friendly interface
- Archive and unarchive notes to keep your workspace organized
- Add and remove categories to notes for better organization
- Filter notes by category to quickly find relevant information
- View separate lists for active and archived notes
- Responsive design for seamless use on desktop and mobile devices

The frontend, built with Next.js 15, offers a modern and intuitive user interface. The backend, powered by Nest.js 10, provides a robust REST API with proper separation of concerns (Controllers, Services, Repositories) for scalability and maintainability. Data persistence is handled through Prisma ORM, connecting to a PostgreSQL database hosted on Supabase for reliable and efficient data storage.

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

e.This script will:

- Install dependencies for both frontend and backend.
- Apply database migrations.
- Generate the Prisma client.
- Start the Nest.js server on port **3001**.
- Start the Next.js development server on port **3000**.

### Accessing the Application

- **Frontend**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
- **Backend API**: Accessible at [http://localhost:3001/api](http://localhost:3001/api).

## API Endpoints

### Notes

- `GET /api/notes` - Retrieve all notes (with optional `active` query parameter).
- `GET /api/notes/active` - Retrieve all active notes.
- `GET /api/notes/archived` - Retrieve all archived notes.
- `GET /api/notes/:id` - Retrieve a note by ID.
- `POST /api/notes` - Create a new note.
- `PUT /api/notes/:id` - Update a note by ID.
- `DELETE /api/notes/:id` - Delete a note by ID.
- `PUT /api/notes/:id/archive` - Toggle archive status of a note by ID.
- `POST /api/notes/:noteId/categories/:categoryId` - Add a category to a note.
- `DELETE /api/notes/:noteId/categories/:categoryId` - Remove a category from a note.
- `GET /api/notes/category/:categoryId` - Get notes by category (with optional `active` query parameter).

### Categories

- `GET /api/categories` - Retrieve all categories.
- `GET /api/categories/:id` - Retrieve a category by ID.
- `POST /api/categories` - Create a new category.
- `PUT /api/categories/:id` - Update a category by ID.
- `DELETE /api/categories/:id` - Delete a category by ID.
- `GET /api/notes/:noteId/categories` - Get categories for a specific note.

## Scripts

### Backend

- `npm run start`: Start the application.
- `npm run start:dev`: Start the application in development mode.
- `npm run build`: Build the application.
- `npm run test`: Run tests.
- `npm run lint`: Lint the codebase.

### Frontend

- `npm run dev`: Start the development server.
- `npm run build`: Build the application.
- `npm run start`: Start the production server.
- `npm run lint`: Lint the codebase.

## Additional Information

### Live Deployment

If deployed, add the URL of the live running version here.
