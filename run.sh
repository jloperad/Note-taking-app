#!/bin/bash

# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Apply database migrations and generate Prisma client
npx prisma migrate deploy
npx prisma generate

# Start the backend server
npm run start:dev &

# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Start the frontend server
npm run dev