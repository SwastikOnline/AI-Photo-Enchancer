# AI Image Enhancer Pro - Hostinger Deployment Guide

## Overview

This guide will walk you through deploying your AI Image Enhancer Pro application to your Hostinger domain. Hostinger provides excellent hosting solutions that can perfectly support your Node.js application.

## Prerequisites

### What You Need
- **Hostinger Account**: With Node.js hosting plan (Business or Cloud plans support Node.js)
- **Domain**: Your purchased domain connected to Hostinger
- **Database**: PostgreSQL database (available on Hostinger Cloud plans)
- **FTP/SSH Access**: For file uploads and server management

### Hostinger Plan Requirements
- **Minimum**: Hostinger Business Plan (supports Node.js applications)
- **Recommended**: Hostinger Cloud Startup or higher (includes PostgreSQL database)
- **Features Needed**: Node.js support, PostgreSQL database, SSL certificate, custom domains

## Step 1: Prepare Your Application

### 1.1 Build the Application
```bash
# In your project directory
npm run build
```

### 1.2 Create Production Environment File
Create `.env.production` file:
```env
NODE_ENV=production
DATABASE_URL=your_hostinger_postgresql_url
PORT=3000
SESSION_SECRET=your_secure_random_string_here
```

### 1.3 Prepare Deployment Package
Create `package-production.json` with production dependencies:
```json
{
  "name": "ai-image-enhancer-pro",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/index.js",
    "postinstall": "npm run db:push"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.30.0",
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "multer": "^1.4.0",
    "connect-pg-simple": "^9.0.0",
    "zod": "^3.22.0",
    "nanoid": "^5.0.0"
  }
}
```

## Step 2: Set Up PostgreSQL Database on Hostinger

### 2.1 Access Database Manager
1. Log into your **Hostinger Control Panel**
2. Navigate to **Databases** → **PostgreSQL Databases**
3. Click **Create New Database**

### 2.2 Create Database
- **Database Name**: `ai_image_enhancer`
- **Username**: Create a dedicated user (e.g., `img_enhancer_user`)
- **Password**: Generate a strong password
- **Privileges**: Grant ALL privileges

### 2.3 Get Connection Details
Note down these details:
- **Host**: Usually `localhost` or provided hostname
- **Port**: Usually `5432`
- **Database**: `ai_image_enhancer`
- **Username**: Your created username
- **Password**: Your created password

### 2.4 Construct Database URL
```
DATABASE_URL=postgresql://username:password@hostname:5432/ai_image_enhancer
```

## Step 3: Deploy to Hostinger

### 3.1 Upload Files via File Manager

#### Method A: Using Hostinger File Manager
1. Access **File Manager** in Hostinger Control Panel
2. Navigate to your domain's `public_html` folder
3. Upload these files and folders:
   ```
   dist/                 (built application)
   uploads/              (create empty folder)
   package.json          (production version)
   .env.production       (rename to .env)
   ```

#### Method B: Using FTP Client
1. Use FTP client (FileZilla, WinSCP, etc.)
2. Connect using Hostinger FTP credentials
3. Upload files to `/public_html/`

### 3.2 Set Up Node.js Application

#### Access Terminal (SSH)
If your plan supports SSH:
```bash
# Connect via SSH
ssh your_username@your_domain.com

# Navigate to your domain folder
cd public_html

# Install dependencies
npm install

# Set up database
npm run db:push
```

#### Using Hostinger Control Panel
1. Go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Set **Application Root**: `/public_html`
4. Set **Application URL**: Your domain
5. Set **Application Startup File**: `dist/index.js`
6. Set **Node.js Version**: 18.x or higher

## Step 4: Configure Environment Variables

### 4.1 Set Environment Variables in Hostinger
1. Go to **Node.js** section in Control Panel
2. Click on your application
3. Add environment variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Your secure random string
   - `PORT`: `3000`

### 4.2 Upload Environment File
Ensure your `.env` file is in the application root with:
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@hostname:5432/ai_image_enhancer
SESSION_SECRET=your_secure_random_string_here
PORT=3000
```

## Step 5: Set Up File Permissions

### 5.1 Create Uploads Directory
```bash
mkdir uploads
chmod 755 uploads
```

### 5.2 Set Proper Permissions
```bash
# Make sure your application can write to uploads
chmod -R 755 uploads/
chmod -R 755 dist/
```

## Step 6: Configure Domain and SSL

### 6.1 Point Domain to Application
1. In Hostinger Control Panel, go to **Domains**
2. Click **Manage** on your domain
3. Set up subdirectory if needed, or point to root

### 6.2 Enable SSL Certificate
1. Go to **Security** → **SSL/TLS**
2. Enable **Let's Encrypt SSL** (free)
3. Force HTTPS redirect

## Step 7: Start Your Application

### 7.1 Start Node.js Application
1. In **Node.js** section, click **Start** on your application
2. Monitor the logs for any errors
3. Check application status

### 7.2 Test Your Application
1. Visit your domain: `https://yourdomain.com`
2. Test image upload functionality
3. Verify database connectivity
4. Check all enhancement features

## Step 8: Production Optimizations

### 8.1 Set Up Process Management
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ai-image-enhancer',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 8.2 Configure Nginx (if available)
If you have access to Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /path/to/your/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Step 9: Monitoring and Maintenance

### 9.1 Monitor Application Health
- Check Node.js application status in Control Panel
- Monitor resource usage (CPU, Memory, Disk)
- Review application logs regularly

### 9.2 Database Maintenance
```sql
-- Clean up old enhancements (run monthly)
DELETE FROM enhancements 
WHERE status = 'completed' 
AND "createdAt" < NOW() - INTERVAL '30 days';

-- Check database size
SELECT pg_size_pretty(pg_database_size('ai_image_enhancer'));
```

### 9.3 File Cleanup
```bash
# Clean old uploaded files (run weekly)
find uploads/ -type f -mtime +7 -delete
```

## Troubleshooting

### Common Issues

#### Application Won't Start
1. **Check Node.js version**: Ensure using Node.js 18.x or higher
2. **Verify dependencies**: Run `npm install` again
3. **Check logs**: Review error logs in Control Panel
4. **Database connection**: Verify DATABASE_URL is correct

#### Database Connection Failed
1. **Check credentials**: Verify username, password, host, port
2. **Test connection**: Use psql or database client to test
3. **Firewall**: Ensure database port is accessible
4. **SSL mode**: Add `?sslmode=require` to DATABASE_URL if needed

#### File Upload Issues
1. **Permissions**: Check uploads directory permissions (755)
2. **Disk space**: Ensure sufficient storage available
3. **File size limits**: Check Hostinger upload limits
4. **Path issues**: Verify uploads path is correct

#### Performance Issues
1. **Resource limits**: Check if hitting plan limits
2. **Database optimization**: Add indexes if needed
3. **File cleanup**: Implement regular cleanup schedule
4. **Caching**: Add caching headers for static files

### Getting Help

#### Hostinger Support
- **Knowledge Base**: Help center with detailed guides
- **Live Chat**: 24/7 customer support
- **Tickets**: Submit technical support requests

#### Application Support
- **Documentation**: Refer to user manual and deployment guide
- **Logs**: Check application and database logs
- **Database**: Use PostgreSQL tools for debugging

## Security Considerations

### 9.1 Environment Security
- **Never commit** `.env` files to version control
- **Use strong passwords** for database and sessions
- **Regular updates**: Keep dependencies updated
- **Monitor access**: Review server logs regularly

### 9.2 Application Security
- **File validation**: Application validates uploaded file types
- **Size limits**: Configured file size restrictions
- **Session security**: Secure session configuration
- **HTTPS only**: Force SSL/TLS encryption

## Performance Optimization

### 10.1 Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_enhancements_user_id ON enhancements(user_id);
CREATE INDEX idx_enhancements_status ON enhancements(status);
CREATE INDEX idx_enhancements_created_at ON enhancements("createdAt");
```

### 10.2 Application Optimization
- **Static file serving**: Use Nginx for static files
- **Compression**: Enable gzip compression
- **Caching**: Implement response caching
- **CDN**: Consider using Hostinger CDN for global delivery

## Backup Strategy

### 10.1 Database Backups
```bash
# Daily database backup
pg_dump ai_image_enhancer > backup_$(date +%Y%m%d).sql
```

### 10.2 File Backups
- **Regular backups**: Schedule backups of uploads directory
- **Version control**: Keep application code in Git
- **Documentation**: Backup configuration files

## Cost Optimization

### 10.1 Plan Selection
- **Business Plan**: Good for testing and low traffic
- **Cloud Startup**: Better for production with database needs
- **Cloud Professional**: For high traffic and advanced features

### 10.2 Resource Management
- **Monitor usage**: Track CPU, memory, and storage
- **Optimize images**: Implement image compression
- **Clean old files**: Regular cleanup saves storage costs
- **Database optimization**: Keep database size manageable

## Conclusion

Your AI Image Enhancer Pro is now successfully deployed on Hostinger! The application provides professional image enhancement capabilities with:

- **Professional Interface**: Dark theme optimized for user engagement
- **Revenue Features**: Advertisement integration and affiliate marketing
- **Robust Processing**: 4-stage AI enhancement pipeline
- **User Management**: Complete enhancement history and storage control
- **Production Ready**: Secure, scalable, and maintainable

For ongoing success:
1. **Monitor performance** regularly
2. **Implement backup strategy**
3. **Keep security updated**
4. **Scale resources** as traffic grows
5. **Optimize for revenue** based on user analytics

Your professional image enhancement service is ready to generate revenue on your Hostinger domain!