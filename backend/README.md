# Backend

## Description

A Nest.js backend for the Note Taking App, utilizing Prisma ORM and PostgreSQL.

## Project Setup

### Prerequisites

- Node.js v18.17
- npm v9.6.7
- PostgreSQL

### Installation

1. **Clone the Repository**

   ```bash
   git clone <your-private-repo-url>
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory with the following structure:

   ```
   # Connect to Supabase via connection pooling with Supavisor.
   DATABASE_URL="your_supabase_connection_string_with_pgbouncer"

   # Direct connection to the database. Used for migrations.
   DIRECT_URL="your_direct_supabase_connection_string"
   ```

   Replace `your_supabase_connection_string_with_pgbouncer` and `your_direct_supabase_connection_string` with your actual Supabase connection strings. You can find these in your Supabase project settings.

4. **Run the Application**

   ```bash
   ./run.sh
   ```

   This script will install dependencies, apply database migrations, generate the Prisma client, and start the Nest.js server.

## Available Scripts

- `npm run start`: Start the application.
- `npm run start:dev`: Start the application in development mode.
- `npm run build`: Build the application.
- `npm run test`: Run tests.
- `npm run lint`: Lint the codebase.

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
