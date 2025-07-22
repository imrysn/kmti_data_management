# KMTI Data Management System

A complete web application for managing engineering drawing files (.icd format) with separate Admin and User interfaces.

## Features

### User Features

- **File Upload**: Drag-and-drop interface for .icd files
- **File Management**: View, download, and manage uploaded files
- **Search**: Fast search functionality across all files
- **File Preview**: Metadata display and file information
- **Dashboard**: Personal statistics and recent activity

### Admin Features

- **Admin Dashboard**: System overview with statistics
- **User Management**: Create, edit, delete, and manage users
- **File Management**: View and manage all files in the system
- **Activity Logs**: Monitor all user actions and system activities
- **Bulk Operations**: Delete multiple files at once

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **React Dropzone** for file uploads

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kmti-data-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd backend && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/kmti_data_management
   DB_NAME=kmti_data_management

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d

   # Server
   PORT=5000
   NODE_ENV=development

   # File Upload
   MAX_FILE_SIZE=50MB
   UPLOAD_PATH=./uploads

   # Frontend
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database** (Optional)

   ```bash
   cd backend && node scripts/seed.js
   ```

   This creates demo users:

   - Admin: `admin` / `admin123`
   - User: `user` / `user123`

6. **Start the application**

   ```bash
   # Start both frontend and backend
   npm run start:full

   # Or start them separately:
   # Backend (in backend directory)
   npm run dev

   # Frontend (in root directory)
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
kmti-data-management/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database scripts
│   └── uploads/            # File storage
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── types/              # TypeScript types
└── public/                 # Static assets
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Files

- `GET /api/files` - Get files (paginated)
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file details
- `GET /api/files/:id/download` - Download file
- `PUT /api/files/:id` - Update file metadata
- `DELETE /api/files/:id` - Delete file
- `POST /api/files/bulk-delete` - Bulk delete files (Admin)

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/reset-password` - Reset user password

### Activity Logs (Admin only)

- `GET /api/activity` - Get activity logs
- `GET /api/activity/stats` - Get activity statistics

## File Upload Requirements

- **Supported formats**: .icd files only
- **Maximum file size**: 50MB
- **Storage**: Local filesystem (configurable)
- **Security**: File type validation and virus scanning consideration

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and User roles
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Only .icd files accepted
- **Activity Logging**: All user actions are logged

## Development

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test
```

### Building for Production

```bash
# Build frontend
npm run build

# The built files will be in the dist/ directory
```

### Database Management

```bash
# Seed database with demo data
cd backend && node scripts/seed.js

# Connect to MongoDB shell
mongo kmti_data_management
```

## Deployment

### Environment Variables for Production

Make sure to set secure values for:

- `JWT_SECRET`: Use a strong, random secret
- `MONGODB_URI`: Your production MongoDB connection string
- `NODE_ENV`: Set to "production"

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
