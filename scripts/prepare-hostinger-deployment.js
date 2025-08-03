#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing AI Image Enhancer Pro for Hostinger Deployment...\n');

// Create deployment directory
const deployDir = 'hostinger-deployment';
if (fs.existsSync(deployDir)) {
  console.log('🗑️  Removing existing deployment directory...');
  fs.rmSync(deployDir, { recursive: true });
}

console.log('📁 Creating deployment directory...');
fs.mkdirSync(deployDir, { recursive: true });

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Copy necessary files
console.log('📋 Copying files...');

// Copy dist folder
if (fs.existsSync('dist')) {
  fs.cpSync('dist', path.join(deployDir, 'dist'), { recursive: true });
  console.log('✅ Copied dist/');
} else {
  console.error('❌ dist/ folder not found. Build may have failed.');
  process.exit(1);
}

// Create uploads directory
fs.mkdirSync(path.join(deployDir, 'uploads'), { recursive: true });
console.log('✅ Created uploads/');

// Create production package.json
const productionPackage = {
  "name": "ai-image-enhancer-pro",
  "version": "1.0.0",
  "description": "Professional AI-powered image enhancement web application",
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
  },
  "keywords": ["ai", "image", "enhancement", "web", "application"],
  "author": "AI Image Enhancer Pro",
  "license": "MIT"
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'), 
  JSON.stringify(productionPackage, null, 2)
);
console.log('✅ Created production package.json');

// Copy drizzle config
if (fs.existsSync('drizzle.config.ts')) {
  fs.copyFileSync('drizzle.config.ts', path.join(deployDir, 'drizzle.config.ts'));
  console.log('✅ Copied drizzle.config.ts');
}

// Create .env template
const envTemplate = `# AI Image Enhancer Pro - Production Environment Variables
# Copy this file to .env and fill in your actual values

NODE_ENV=production

# Database Configuration (Get from Hostinger PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Session Security (Generate a random string)
SESSION_SECRET=your_secure_random_string_here_minimum_32_characters

# Server Configuration
PORT=3000

# Optional: File Upload Limits
MAX_FILE_SIZE=52428800

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

fs.writeFileSync(path.join(deployDir, '.env.template'), envTemplate);
console.log('✅ Created .env.template');

// Create deployment instructions
const deploymentInstructions = `# Hostinger Deployment Instructions

## Quick Start
1. Upload all files to your domain's public_html folder
2. Copy .env.template to .env and fill in your values
3. In Hostinger Control Panel, create Node.js application
4. Set startup file to: dist/index.js
5. Install dependencies: npm install
6. Run database setup: npm run db:push
7. Start application

## Files Included
- dist/              - Built application
- uploads/           - Empty uploads directory
- package.json       - Production dependencies
- drizzle.config.ts  - Database configuration
- .env.template      - Environment variables template

## Required Environment Variables
- DATABASE_URL: Your Hostinger PostgreSQL connection string
- SESSION_SECRET: Random string for session security
- NODE_ENV: Set to "production"

## Hostinger Requirements
- Business Plan or higher (Node.js support)
- PostgreSQL database enabled
- Node.js 18.x or higher

## Support
Refer to docs/hostinger-deployment-guide.md for detailed instructions.
`;

fs.writeFileSync(path.join(deployDir, 'DEPLOYMENT.md'), deploymentInstructions);
console.log('✅ Created DEPLOYMENT.md');

// Create startup script for PM2 (if available)
const pm2Config = {
  "apps": [{
    "name": "ai-image-enhancer-pro",
    "script": "dist/index.js",
    "instances": 1,
    "autorestart": true,
    "watch": false,
    "max_memory_restart": "1G",
    "env": {
      "NODE_ENV": "production",
      "PORT": 3000
    },
    "error_file": "./logs/err.log",
    "out_file": "./logs/out.log",
    "log_file": "./logs/combined.log",
    "time": true
  }]
};

fs.writeFileSync(
  path.join(deployDir, 'ecosystem.config.js'), 
  `module.exports = ${JSON.stringify(pm2Config, null, 2)};`
);
console.log('✅ Created PM2 configuration');

// Create logs directory
fs.mkdirSync(path.join(deployDir, 'logs'), { recursive: true });
console.log('✅ Created logs directory');

// Get deployment package size
const getDirectorySize = (dirPath) => {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  });
  
  return totalSize;
};

const deploymentSize = getDirectorySize(deployDir);
const sizeInMB = (deploymentSize / (1024 * 1024)).toFixed(2);

console.log('\n🎉 Hostinger deployment package ready!');
console.log(`📦 Package size: ${sizeInMB} MB`);
console.log(`📁 Location: ${deployDir}/`);
console.log('\n📋 Next Steps:');
console.log('1. Upload all files in hostinger-deployment/ to your domain\'s public_html/');
console.log('2. Copy .env.template to .env and configure your values');
console.log('3. Create PostgreSQL database in Hostinger Control Panel');
console.log('4. Set up Node.js application pointing to dist/index.js');
console.log('5. Install dependencies: npm install');
console.log('6. Run: npm run db:push');
console.log('7. Start your application!');
console.log('\n📖 Full guide: docs/hostinger-deployment-guide.md');
console.log('🚀 Your AI Image Enhancer Pro is ready for deployment!');