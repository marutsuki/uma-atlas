# Legacy CRUD API Documentation

## Overview

This document describes the authenticated CRUD system for the Legacy model, implemented following the existing `/api/iam` feature-based structure of the project.

## Architecture

The Legacy module follows a layered architecture pattern:

```
/api/legacy/
├── models/Legacy.ts          # TypeScript interfaces and DTOs
├── dao/legacyDao.ts         # Data Access Object for database operations
├── services/legacyService.ts # Business logic layer
├── controllers/legacyController.ts # HTTP request handlers
└── routes/legacyRoutes.ts   # Route definitions
```

## Database Schema

### Legacy Model
- `id`: String (Primary Key)
- `active`: Boolean (indicates if this is the user's active legacy)
- `userId`: String (Foreign Key to User)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: `blueSpark`, `pinkSpark`, `user`

### BlueSpark Model
- `type`: BlueSparkType enum (SPEED, STAMINA, POWER, GUTS, WIT)
- `stars`: Integer (1-3)
- `legacyId`: String (Primary Key, Foreign Key to Legacy)

### PinkSpark Model
- `type`: PinkSparkType enum (TURF, DIRT, SPRINT, MILE, MIDDLE_DISTANCE, LONG_DISTANCE, FRONT_RUNNER, PACE_CHASER, LATE_SURGER, END_CLOSER)
- `stars`: Integer (1-3)
- `legacyId`: String (Primary Key, Foreign Key to Legacy)

## API Endpoints

### Base URL: `/api/legacy`

All endpoints require authentication via JWT token.

#### GET `/` - Get All Legacies
- **Access**: Any authenticated user
- **Description**: Retrieves all legacies from all users
- **Response**: Array of LegacyResponse objects

#### GET `/user/:userId` - Get User's Legacies
- **Access**: Any authenticated user
- **Description**: Retrieves all legacies for a specific user
- **Parameters**: `userId` - User ID
- **Response**: Array of LegacyResponse objects

#### GET `/user/:userId/active` - Get User's Active Legacy
- **Access**: Any authenticated user
- **Description**: Retrieves the active legacy for a specific user
- **Parameters**: `userId` - User ID
- **Response**: LegacyResponse object or 404 if no active legacy

#### GET `/:id` - Get Legacy by ID
- **Access**: Any authenticated user
- **Description**: Retrieves a specific legacy by ID
- **Parameters**: `id` - Legacy ID
- **Response**: LegacyResponse object

#### POST `/` - Create New Legacy
- **Access**: Authenticated users (creates for themselves)
- **Description**: Creates a new legacy for the authenticated user
- **Body**: CreateLegacyRequest
- **Business Logic**:
  - At least one spark (blue or pink) must be provided
  - Star values must be between 1-3
  - Automatically deactivates user's existing active legacy
  - New legacy is created as active
- **Response**: LegacyResponse object (201 Created)

#### PUT `/:id` - Update Legacy
- **Access**: Owner or Admin
- **Description**: Updates an existing legacy
- **Parameters**: `id` - Legacy ID
- **Body**: UpdateLegacyRequest
- **Business Logic**:
  - Users can only update their own legacies (unless admin)
  - If `active: true` is provided, deactivates other user's legacies
  - Star values must be between 1-3 if provided
- **Response**: LegacyResponse object

#### DELETE `/:id` - Delete Legacy
- **Access**: Owner or Admin
- **Description**: Hard deletes a legacy
- **Parameters**: `id` - Legacy ID
- **Business Logic**:
  - Users can only delete their own legacies (unless admin)
  - Cascades to delete related sparks
- **Response**: 204 No Content

## Request/Response Models

### CreateLegacyRequest
```typescript
{
  blueSpark?: {
    type: BlueSparkType;
    stars: number; // 1-3
  };
  pinkSpark?: {
    type: PinkSparkType;
    stars: number; // 1-3
  };
}
```

### UpdateLegacyRequest
```typescript
{
  active?: boolean;
  blueSpark?: {
    type?: BlueSparkType;
    stars?: number; // 1-3
  };
  pinkSpark?: {
    type?: PinkSparkType;
    stars?: number; // 1-3
  };
}
```

### LegacyResponse
```typescript
{
  id: string;
  active: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  blueSpark?: {
    type: BlueSparkType;
    stars: number;
  };
  pinkSpark?: {
    type: PinkSparkType;
    stars: number;
  };
  user?: {
    id: string;
    username: string;
    friendCode: string;
  };
}
```

## Business Rules

### Legacy Creation
1. **Spark Requirement**: At least one spark (blue or pink) must be provided
2. **Star Validation**: Star values must be integers between 1 and 3 (inclusive)
3. **Active Legacy Management**: When creating a new legacy, any existing active legacy for the user is automatically set to inactive
4. **Default State**: New legacies are created with `active: true`

### Legacy Updates
1. **Ownership**: Users can only update their own legacies (admins can update any)
2. **Active Status**: If `active: true` is provided in the update, all other legacies for that user are set to inactive
3. **Spark Updates**: Can update existing sparks or create new ones if they don't exist
4. **Validation**: Same star validation rules apply (1-3 stars)

### Legacy Deletion
1. **Ownership**: Users can only delete their own legacies (admins can delete any)
2. **Hard Delete**: Complete removal from database (no soft delete)
3. **Cascade**: Related BlueSpark and PinkSpark records are automatically deleted

## Access Control

### Public Read Access
- Any authenticated user can view any legacy or user profile
- This supports the frontend requirement where users can view other users' profiles and legacies

### Protected Write Access
- **Create**: Users can only create legacies for themselves
- **Update**: Users can only update their own legacies
- **Delete**: Users can only delete their own legacies

### Admin Override
- Admins have full CRUD access to any user's legacies
- Admin status is determined by `role: 'ADMIN'` in the JWT token

## Constants Configuration

Spark validation constants are defined in `/src/constants/legacy.ts`:
```typescript
export const SPARK_VALIDATION = {
    MIN_STARS: 1,
    MAX_STARS: 3,
} as const;
```

## Error Handling

The API uses the existing error handling middleware and returns appropriate HTTP status codes:

- **400 Bad Request**: Validation errors (missing sparks, invalid star values)
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions (trying to modify others' legacies)
- **404 Not Found**: Legacy not found
- **500 Internal Server Error**: Server errors

## Example Usage

### Create a Legacy
```bash
POST /api/legacy
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "blueSpark": {
    "type": "SPEED",
    "stars": 3
  },
  "pinkSpark": {
    "type": "TURF",
    "stars": 2
  }
}
```

### Update Legacy to Active
```bash
PUT /api/legacy/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "active": true,
  "blueSpark": {
    "stars": 3
  }
}
```

### Get User's Active Legacy
```bash
GET /api/legacy/user/user123/active
Authorization: Bearer <jwt_token>
```

## Integration

The Legacy API is integrated into the main application at `/api/legacy` and follows the same patterns as the existing IAM module for consistency and maintainability.
