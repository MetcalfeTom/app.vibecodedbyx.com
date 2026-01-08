# Content Manager - Application Documentation CMS

A Payload CMS application for managing documentation of all VibeCodedByX built applications.

## Features

- **Application Documentation**: Manage comprehensive docs for each app
- **Rich Text Editor**: Lexical editor for beautiful documentation
- **Features & Tech Stack**: Track key features and technologies used
- **Screenshots**: Add visual documentation
- **Status Tracking**: Mark apps as Active, In Development, or Deprecated
- **Search & Filter**: Easy navigation through all applications

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or remote)

## Setup Instructions

1. **Install MongoDB** (if not already installed):
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install mongodb

   # On macOS
   brew install mongodb-community

   # Start MongoDB
   sudo systemctl start mongodb  # Linux
   brew services start mongodb-community  # macOS
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Edit `.env` file and update `DATABASE_URI` if needed
   - Change `PAYLOAD_SECRET` to a secure random string

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Frontend: `http://localhost:3001` (or via static HTML at `/vibespace/apps/content-manager/index.html`)
   - Admin Panel: `http://localhost:3001/admin`

6. **Create First Admin User**:
   - Go to the admin panel
   - Create your first user account
   - This will be your login for managing content

## Usage

### Adding Application Documentation

1. Log into the admin panel at `http://localhost:3001/admin`
2. Navigate to "Applications" collection
3. Click "Create New"
4. Fill in:
   - App Name
   - Slug (folder name)
   - Description
   - Icon (emoji)
   - Category
   - Live URL
   - Full documentation (rich text)
   - Features list
   - Technologies used
   - Screenshots
   - Status

### Viewing Documentation

- Visit the frontend at `http://localhost:3001`
- Browse all applications
- Search by name or description
- Click "Launch App" to visit live apps
- Click "View Docs" to see full documentation in admin

## Collections

### Applications
- Complete app documentation
- Features, tech stack, screenshots
- Status tracking
- Rich text documentation

### Pages
- Additional documentation pages
- Guides, tutorials, etc.

### Users
- Admin users with authentication

## Development

```bash
# Run dev server with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Production Deployment

1. Set up MongoDB (MongoDB Atlas recommended)
2. Update `.env` with production DATABASE_URI
3. Set secure PAYLOAD_SECRET
4. Build: `npm run build`
5. Start: `npm start`
6. Configure reverse proxy (nginx/Apache) to serve on port 80/443

## Tech Stack

- **Payload CMS**: Headless CMS framework
- **MongoDB**: Database
- **Express**: Web server
- **TypeScript**: Type-safe development
- **Lexical**: Rich text editor

## Notes

- MongoDB must be running before starting the server
- Default port is 3001 (configurable in `.env`)
- First user created becomes super admin
- All data is stored in MongoDB database
