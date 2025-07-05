<div align="center"><img height="200px" src="assets/uma-atlas-logo.png"/></div>


# Uma Atlas

## Description

This project is planned to be released as a platform for Umamusume Global players to collaborate and share their profiles (and legacies + support cards).

Could potentially look into adding more depending on traffic, eg. tier lists.

## Architecture

Uma Atlas is a full-stack web application built with:

- **Backend**: Node.js/TypeScript Express API with PostgreSQL database
- **Frontend**: React 19 with TypeScript and Vite
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication system
- **Containerization**: Docker for database setup

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:marutsuki/uma-atlas.git
   cd uma-atlas
   ```

2. **Start the database**
   ```bash
   cd server
   docker-compose up -d
   ```

3. **Set up the backend**
   ```bash
   # Install dependencies
   npm install
   
   # Copy environment file
   cp .env.example .env
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database (optional)
   npm run db:seed
   
   # Start the server
   npm run dev
   ```

4. **Set up the frontend** (in a new terminal)
   ```bash
   cd client-web
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001
   - Database Admin (Prisma Studio): `npm run db:studio` in server directory

## Development Setup

### Backend Setup (server/)

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/uma_atlas"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   NODE_ENV="development"
   PORT=3001
   
   # CORS
   CORS_ORIGIN="http://localhost:8080"
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL with Docker
   docker-compose up -d
   
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database (optional)
   npm run db:seed
   ```

4. **Available Scripts**
   ```bash
   npm run dev          # Start development server with hot reload
   npm run build        # Build for production
   npm run start        # Start production server
   npm run db:migrate   # Run database migrations
   npm run db:seed      # Seed database with initial data
   npm run db:studio    # Open Prisma Studio (database admin UI)
   npm run db:generate  # Generate Prisma client
   npm run db:reset     # Reset database (caution: deletes all data)
   ```

### Frontend Setup (client-web/)

1. **Install dependencies**
   ```bash
   cd client-web
   npm install
   ```

2. **Available Scripts**
   ```bash
   npm run dev          # Start development server (port 8080)
   npm run build        # Build for production
   npm run preview      # Preview production build
   npm run lint         # Run ESLint
   ```

## Database

### Schema Overview

The application uses PostgreSQL with the following main entities:

- **User**: User accounts with authentication
- **Legacy**: User-created legacy configurations
- **UmaMusume**: Character data
- **BlueSpark/PinkSpark**: Legacy enhancement attributes

### Database Management

```bash
# View database in browser
npm run db:studio

# Reset database (development only)
npm run db:reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

## Project Structure

```
uma-atlas/
├── client-web/                 # React frontend application
│   ├── src/
│   │   ├── app/               # Main application components
│   │   ├── components/        # Reusable UI components
│   │   ├── config/           # Configuration files
│   │   ├── lib/              # Utility libraries
│   │   ├── model/            # TypeScript models
│   │   └── store/            # Redux store and slices
│   ├── public/               # Static assets
│   └── package.json
├── server/                     # Node.js backend API
│   ├── src/
│   │   ├── api/              # API modules
│   │   │   ├── iam/          # Identity and Access Management
│   │   │   └── legacy/       # Legacy management
│   │   ├── config/           # Configuration files
│   │   ├── constants/        # Application constants
│   │   └── middleware/       # Express middleware
│   ├── prisma/               # Database schema and migrations
│   ├── docker-compose.yml    # Database container setup
│   └── package.json
└── README.md
```

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Development**: nodemon, ts-node

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

### Development Tools
- **Containerization**: Docker & Docker Compose
- **Database Admin**: Prisma Studio
- **Linting**: ESLint
- **Type Checking**: TypeScript

## API Documentation

- **Legacy API**: See [server/LEGACY_API_DOCUMENTATION.md](server/LEGACY_API_DOCUMENTATION.md) for detailed API documentation
- **Base URL**: `http://localhost:3001/api`
- **Authentication**: JWT Bearer token required for most endpoints

## Environment Variables

### Server (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/uma_atlas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

## Contributing

To be added.

For now, the repo is configured so that any changes to main has to be done via a PR (with approval).

## License

MIT License, see `LICENSE` for more info.

## Support

Contact me at `lucienlu2000@gmail.com`
