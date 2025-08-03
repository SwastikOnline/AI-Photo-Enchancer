# AI Image Enhancer Pro - Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Methods](#deployment-methods)
4. [Replit Deployment (Recommended)](#replit-deployment)
5. [Manual Server Deployment](#manual-server-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [Domain Configuration](#domain-configuration)
9. [SSL Certificate Setup](#ssl-certificate-setup)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)
11. [Troubleshooting](#troubleshooting)

## Overview

AI Image Enhancer Pro is a professional web application built with:
- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Local filesystem (configurable for cloud storage)
- **AI Processing**: Simulated processing (ready for integration with services like Replicate)

## Prerequisites

### System Requirements
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **PostgreSQL**: Version 14 or higher
- **Server**: Linux-based system with minimum 2GB RAM
- **Storage**: Minimum 10GB free space for image uploads

### Domain Requirements
- Purchased domain name
- DNS management access
- SSL certificate (Let's Encrypt recommended)

## Deployment Methods

### Method 1: Replit Deployment (Recommended)

#### Step 1: Prepare Your Replit Project
1. Ensure your project is working locally
2. All environment variables are configured
3. Database is properly set up and connected

#### Step 2: Deploy via Replit
1. Navigate to your Replit project
2. Click the "Deploy" button in the top-right corner
3. Choose "Autoscale" deployment for production traffic
4. Configure your custom domain (if purchased)
5. Set up environment variables in deployment settings

#### Step 3: Configure Custom Domain
1. Go to Replit Deployments dashboard
2. Click "Domains" in your deployment
3. Add your custom domain
4. Update DNS records as instructed:
   - Type: CNAME
   - Name: @ (or subdomain)
   - Value: your-app.replit.app

#### Step 4: SSL Configuration
- Replit automatically handles SSL certificates
- Your site will be accessible via HTTPS

### Method 2: Manual Server Deployment

#### Step 1: Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt-get install -y nginx

# Install Certbot for SSL
sudo apt-get install -y certbot python3-certbot-nginx
```

#### Step 2: Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive --pwprompt aienhancer

# Create database
sudo -u postgres createdb aienhancer_db -O aienhancer

# Configure PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Enable connections: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host aienhancer_db aienhancer 0.0.0.0/0 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Step 3: Application Deployment
```bash
# Clone your repository
git clone https://github.com/yourusername/ai-image-enhancer.git
cd ai-image-enhancer

# Install dependencies
npm install

# Build the application
npm run build

# Create environment file
nano .env
```

#### Step 4: Environment Configuration
```env
# Database Configuration
DATABASE_URL=postgresql://aienhancer:password@localhost:5432/aienhancer_db
PGHOST=localhost
PGPORT=5432
PGUSER=aienhancer
PGPASSWORD=your_password
PGDATABASE=aienhancer_db

# Application Configuration
NODE_ENV=production
PORT=3000

# Optional: Add API keys for future integrations
# REPLICATE_API_TOKEN=your_replicate_token
# OPENAI_API_KEY=your_openai_key
```

#### Step 5: Database Migration
```bash
# Run database migration
npm run db:push

# Verify database connection
npm run db:studio
```

#### Step 6: Process Management
```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ai-image-enhancer',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
};
```

#### Step 7: Nginx Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/aienhancer
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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
        proxy_read_timeout 86400;
    }

    location /uploads {
        alias /path/to/your/app/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 50M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/aienhancer /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 8: SSL Certificate Setup
```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Environment Configuration

### Required Environment Variables
```env
# Database (Required)
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database

# Application (Required)
NODE_ENV=production
PORT=3000

# Optional API Keys (for future integrations)
REPLICATE_API_TOKEN=your_token
OPENAI_API_KEY=your_key
```

## Database Setup

### PostgreSQL Configuration
1. **Create Database User**:
   ```sql
   CREATE USER aienhancer WITH PASSWORD 'secure_password';
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE aienhancer_db OWNER aienhancer;
   ```

3. **Grant Permissions**:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE aienhancer_db TO aienhancer;
   ```

### Schema Migration
```bash
# Install Drizzle CLI
npm install -g drizzle-kit

# Push schema to database
npm run db:push

# Verify schema
npm run db:studio
```

## Domain Configuration

### DNS Setup
1. **A Record**: Point to your server's IP
   - Type: A
   - Name: @
   - Value: YOUR_SERVER_IP

2. **CNAME Record**: For www subdomain
   - Type: CNAME
   - Name: www
   - Value: yourdomain.com

3. **Verification**: Use `dig` command to verify
   ```bash
   dig yourdomain.com
   dig www.yourdomain.com
   ```

## SSL Certificate Setup

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal cron job
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Commercial SSL Certificate
1. Purchase SSL certificate from CA
2. Generate CSR on your server
3. Upload certificate files to server
4. Configure Nginx with certificate paths

## Monitoring and Maintenance

### Health Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs ai-image-enhancer

# Monitor resources
pm2 monit
```

### Database Maintenance
```bash
# Backup database
pg_dump -U aienhancer -h localhost aienhancer_db > backup.sql

# Restore database
psql -U aienhancer -h localhost aienhancer_db < backup.sql
```

### Log Management
```bash
# Rotate logs
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connectivity
psql -U aienhancer -h localhost -d aienhancer_db
```

#### Port Conflicts
```bash
# Check port usage
sudo netstat -tlnp | grep :3000

# Kill process using port
sudo kill -9 PID
```

#### Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

#### SSL Certificate Issues
```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal
```

### Performance Optimization

#### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_enhancements_status ON enhancements(status);
CREATE INDEX idx_enhancements_created_at ON enhancements(created_at);
CREATE INDEX idx_enhancements_user_id ON enhancements(user_id);
```

#### Nginx Optimization
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 10240;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Security Considerations

### Server Security
```bash
# Update system regularly
sudo apt update && sudo apt upgrade

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
```

### Application Security
- Use environment variables for sensitive data
- Implement rate limiting
- Validate all user inputs
- Use HTTPS only
- Regular security updates

## Maintenance Schedule

### Daily
- Monitor application logs
- Check system resources
- Verify SSL certificate status

### Weekly
- Database backup
- Log rotation
- Security updates

### Monthly
- Full system backup
- Performance analysis
- Security audit

This deployment guide provides comprehensive instructions for deploying your AI Image Enhancer Pro application to production environments. Choose the method that best fits your technical requirements and budget.