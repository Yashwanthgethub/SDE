# Project Explanation

## Overview
This project is a **Knowledge Base Platform** designed to help individuals and teams create, manage, and collaborate on documents efficiently. It supports secure user authentication, document editing with a WYSIWYG interface, sharing and permissions, version history, and more. The platform is suitable for personal knowledge management, team wikis, or collaborative documentation.

## Key Features
- **User Authentication:** Supports email/password and Google OAuth login. JWT is used for secure session management.
- **Document Management:** Users can create, edit (with a WYSIWYG editor), view, and delete documents. Auto-save ensures no work is lost.
- **Collaboration:** Documents can be shared with other users, with fine-grained permissions (view/edit). Mentions and sharing features enable teamwork.
- **Privacy Controls:** Documents can be set as public or private.
- **Version History:** Each document maintains a version history, allowing users to view and compare previous versions.
- **Responsive UI:** Modern, user-friendly interface built with React.

## Technology Stack
- **Frontend:** React (with Context API for state management), Tiptap (WYSIWYG editor), JWT for auth, REST API integration.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Passport.js for authentication, Nodemailer for email features.

## Typical Use Cases
- Personal or team knowledge base
- Internal company wiki
- Collaborative document editing and sharing

# Knowledge Base Platform

A modern, full-stack document management and collaboration platform for teams, featuring real-time document creation, sharing, and organization.

## Features

### User Authentication & Security
- Secure JWT-based authentication
- User registration, login, and logout
- Password reset via email
- Google OAuth integration (optional)

### Document Management
- Create, edit, and delete documents with rich text support
- Organize documents as public or private
- Version history for documents
- Soft-delete (Trash) and restore documents
- Permanent deletion from Trash

### Collaboration
- Add collaborators to documents with view or edit permissions
- Mention users in documents to trigger notifications
- Real-time updates for document changes (if enabled)

### User Interface
- Modern, responsive dashboard with sidebar navigation
- Prominent header and always-visible navigation
- "My Documents", "Shared with Me", "Trash", and "Account Settings" pages
- Full-screen "New Document" creation page
- Document grid/list with filters and sorting
- Account settings management

### Notifications
- In-app notifications for mentions and shares
- Mark notifications as read/unread

### Backend API
- RESTful API for all document and user operations
- Endpoints for document CRUD, collaboration, trash, and user info
- MongoDB data models for users and documents

## Tech Stack

- **Frontend:** React, Material-UI, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, Passport, JWT
- **Other:** Nodemailer (email), bcryptjs (password hashing), dotenv (env config)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- (Optional) Google OAuth credentials for social login

### Installation

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Associate_engineer
```

#### 2. Backend Setup

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI, JWT secret, and email credentials
npm start
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

#### 4. Environment Variables

- **Backend:**  
  Create a `.env` file in `/backend` with:
  ```
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  EMAIL_USER=your_email
  EMAIL_PASS=your_email_password
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  ```
- **Frontend:**  
  Update API URLs in `frontend/src/services/documentService.js` if needed.

### Usage

- Register or log in to access the dashboard.
- Create, edit, and organize documents.
- Add collaborators and manage permissions.
- Restore or permanently delete trashed documents.
- Manage your account settings.

## Folder Structure

```
Associate_engineer/
  backend/      # Express API, MongoDB models, controllers, routes
  frontend/     # React app, pages, components, services
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create document
- `GET /api/documents/my` - List user's documents
- `GET /api/documents/trash` - List trashed documents
- `PATCH /api/documents/:id/soft-delete` - Move to trash
- `PATCH /api/documents/:id/restore` - Restore from trash
- `DELETE /api/documents/:id/permanent` - Permanently delete
- `POST /api/documents/:id/collaborators` - Add collaborator
- ...and more

## License

This project is licensed under the ISC License.
