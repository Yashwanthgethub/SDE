# Project Explanation (Detailed)

## Overview
This Knowledge Base Platform is a full-stack web application designed for individuals and teams to create, manage, and collaborate on documents. It offers robust authentication, rich document editing, sharing, versioning, and privacy controls, making it ideal for personal knowledge management, team wikis, and collaborative documentation.

---

## Feature Breakdown & Implementation

### 1. User Authentication
- **Email/Password Login:** Users can register and log in using their email and password. Passwords are securely hashed and stored.
- **Google OAuth Login:** Users can sign in with their Google account. New Google users are created in the database on first login.
- **JWT Sessions:** Upon login, a JWT is issued and used for authenticating API requests, ensuring secure, stateless sessions.
- **Password Reset:** Users can request a password reset link via email (Nodemailer + Gmail App Passwords).

### 2. Document Management
- **Create, Edit, Delete:** Users can create new documents, edit existing ones, and delete documents they own.
- **WYSIWYG Editor:** The Tiptap editor provides a modern, rich-text editing experience, supporting formatting, lists, links, and more.
- **Auto-save:** Edits are automatically saved at regular intervals, reducing the risk of data loss.
- **Document Listing:** Users can view lists of their own documents, documents shared with them, and trashed documents.

### 3. Collaboration & Sharing
- **Sharing:** Documents can be shared with other users by email. Owners can specify view or edit permissions for each collaborator.
- **Mentions:** Users can mention collaborators within documents (UI support for mentions is present in the editor).
- **Shared With Me:** A dedicated page lists all documents shared with the logged-in user.
- **Permissions:** Only users with edit permission can modify a document; view-only users cannot make changes.

### 4. Privacy Controls
- **Public/Private Toggle:** Documents can be set as public (accessible by anyone with the link) or private (restricted to owner/collaborators).
- **Access Enforcement:** Backend middleware checks permissions on every document API request.

### 5. Version History & Diff View
- **Versioning:** Every time a document is saved, a new version is stored. Users can view the version history of each document.
- **Diff View:** Users can compare two versions of a document to see what has changed (UI for diff view is provided).

### 6. Account Management
- **Profile Settings:** Users can update their profile information and change their password.
- **Account Deletion:** Users can delete their account, which also removes their documents.

### 7. Responsive UI/UX
- **Modern Design:** The frontend uses React with a clean, responsive layout, including a sidebar, header, and intuitive navigation.
- **Protected Routes:** Only authenticated users can access protected pages.

---

## Requirements Mapping

| Requirement                | Implementation Summary                                                                 |
|----------------------------|--------------------------------------------------------------------------------------|
| Email/Password Auth        | Custom backend with JWT, bcrypt, and user model                                       |
| Google Login               | Passport.js Google OAuth2 strategy, user creation on first login                      |
| JWT Auth                   | JWT issued on login, verified on all protected API routes                             |
| Document CRUD              | REST API endpoints, Tiptap editor, auto-save, documentService.js                      |
| WYSIWYG Editor             | Tiptap integrated in New/Edit Document pages                                          |
| Auto-save                  | Auto-save logic in document editor components                                         |
| Mentions                   | Tiptap mentions extension, UI for tagging users                                       |
| Sharing/Permissions        | Share dialog, backend collaborator model, permission checks                           |
| Public/Private Docs        | Privacy toggle in UI, enforced in backend                                             |
| Version History            | Version model, version list UI, diff view                                             |
| Diff View                  | UI to compare document versions                                                       |
| Shared With Me             | Page lists documents where user is a collaborator                                     |
| Trash/Restore              | Trashed docs page, soft delete, restore endpoint                                     |
| Password Reset             | Nodemailer integration, reset token, email link                                       |
| Account Settings           | Profile page, update info, change password                                            |
| Responsive UI              | React, CSS, mobile-friendly layout                                                    |

---

## Technology Stack
- **Frontend:** React, Context API, Tiptap, JWT, REST API
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Passport.js, Nodemailer

---

## Typical Use Cases
- Personal or team knowledge base
- Internal company wiki
- Collaborative document editing and sharing 