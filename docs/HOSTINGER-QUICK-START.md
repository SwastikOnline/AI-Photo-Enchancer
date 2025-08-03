# Quick Start: Deploy to Hostinger Domain

## What You Need
1. **Hostinger Business Plan or higher** (supports Node.js)
2. **PostgreSQL database** (available on Cloud plans)
3. **Your domain** connected to Hostinger

## Step-by-Step Deployment

### 1. Build Your Application
```bash
npm run build
```

### 2. Create Production Files

#### Create production package.json:
```json
{
  "name": "ai-image-enhancer-pro",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "db:push": "npx drizzle-kit push"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.30.0",
    "drizzle-kit": "^0.20.0",
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "multer": "^1.4.0",
    "connect-pg-simple": "^9.0.0",
    "zod": "^3.22.0",
    "nanoid": "^5.0.0",
    "ws": "^8.16.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Create .env file:
```env
NODE_ENV=production
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_db
SESSION_SECRET=your_secure_random_string_32_chars_minimum
PORT=3000
```

### 3. Upload Files to Hostinger

Upload these folders/files to your domain's `public_html`:
- `dist/` folder (your built application)
- `uploads/` folder (create empty folder)
- `package.json` (production version)
- `.env` (with your configuration)
- `drizzle.config.ts`

### 4. Set Up Database

1. **Hostinger Control Panel** → **Databases** → **PostgreSQL**
2. **Create New Database**:
   - Name: `ai_image_enhancer`
   - User: Create dedicated user
   - Password: Strong password
3. **Note connection details** for your .env file

### 5. Configure Node.js Application

1. **Hostinger Control Panel** → **Advanced** → **Node.js**
2. **Create Application**:
   - Application Root: `/public_html`
   - Application URL: Your domain
   - Startup File: `dist/index.js`
   - Node.js Version: 18.x or higher

### 6. Install Dependencies & Start

```bash
# In your domain's file manager terminal or SSH:
cd public_html
npm install
npm run db:push
```

Then start your application from Hostinger's Node.js panel.

### 7. Enable SSL

1. **Security** → **SSL/TLS** 
2. Enable **Let's Encrypt SSL** (free)
3. Force HTTPS redirect

## Your App is Live! 🚀

Visit your domain to see your AI Image Enhancer Pro running with:
- Professional dark theme interface
- 4-stage AI enhancement pipeline  
- Advertisement integration for revenue
- Complete enhancement history
- Mobile-responsive design

## Quick Troubleshooting

- **App won't start**: Check Node.js version and dependencies
- **Database errors**: Verify DATABASE_URL connection string
- **File uploads fail**: Check uploads folder permissions (755)
- **SSL issues**: Wait 10-15 minutes for certificate propagation

## Need Help?

Refer to the complete guide: `docs/hostinger-deployment-guide.md`