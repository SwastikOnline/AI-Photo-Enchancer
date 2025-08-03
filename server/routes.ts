import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertEnhancementSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed!'));
    }
  }
});

// Simulate AI processing with Replicate API
async function processImageWithAI(imagePath: string, enhancementType: string): Promise<{ enhancedPath: string; processingTime: number }> {
  const startTime = Date.now();
  
  console.log(`Starting AI processing for: ${imagePath}, type: ${enhancementType}`);
  
  // Check if original file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Original file not found: ${imagePath}`);
  }
  
  // Simulate processing time (2-5 seconds)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));
  
  // In a real implementation, you would:
  // 1. Upload the image to Replicate
  // 2. Run the appropriate AI model
  // 3. Download the enhanced image
  // 4. Save it to the filesystem
  
  const processingTime = (Date.now() - startTime) / 1000;
  const enhancedPath = imagePath.replace(/^uploads\//, 'uploads/enhanced_');
  
  console.log(`Enhanced path will be: ${enhancedPath}`);
  
  // For demo purposes, copy the original file as "enhanced"
  // In production, this would be the actual enhanced image from AI
  try {
    fs.copyFileSync(imagePath, enhancedPath);
    console.log(`File copied successfully from ${imagePath} to ${enhancedPath}`);
  } catch (error) {
    console.error(`Failed to copy file: ${error}`);
    throw error;
  }
  
  return { enhancedPath, processingTime };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.use('/uploads', express.static('uploads'));

  // Upload and enhance image
  app.post('/api/enhance', upload.single('image'), async (req, res) => {
    try {
      console.log('Upload request received:', { 
        hasFile: !!req.file, 
        body: req.body,
        file: req.file ? { 
          originalname: req.file.originalname, 
          mimetype: req.file.mimetype, 
          size: req.file.size,
          path: req.file.path
        } : null 
      });

      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const { enhancementType = 'upscale' } = req.body;
      
      if (!['upscale', 'denoise', 'sharpen', 'restore'].includes(enhancementType)) {
        return res.status(400).json({ message: 'Invalid enhancement type' });
      }

      // Create enhancement record
      const enhancement = await storage.createEnhancement({
        originalFilename: req.file.originalname,
        originalPath: req.file.path,
        enhancementType,
        userId: null, // For guest users
      });

      // Start AI processing (in background)
      processImageWithAI(req.file.path, enhancementType)
        .then(({ enhancedPath, processingTime }) => {
          console.log(`Enhancement completed: ${enhancement.id}, path: ${enhancedPath}`);
          storage.updateEnhancement(enhancement.id, {
            enhancedPath,
            processingTime,
            status: 'completed'
          });
        })
        .catch((error) => {
          console.error('AI processing failed for enhancement', enhancement.id, ':', error);
          storage.updateEnhancement(enhancement.id, {
            status: 'failed'
          });
        });

      res.json({
        id: enhancement.id,
        originalPath: req.file.path,
        status: 'processing',
        enhancementType
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      res.status(500).json({ message: 'Enhancement failed' });
    }
  });

  // Get enhancement status
  app.get('/api/enhance/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const enhancement = await storage.getEnhancement(id);
      
      if (!enhancement) {
        return res.status(404).json({ message: 'Enhancement not found' });
      }

      res.json(enhancement);
    } catch (error) {
      console.error('Get enhancement error:', error);
      res.status(500).json({ message: 'Failed to get enhancement' });
    }
  });

  // Get recent enhancements
  app.get('/api/enhancements/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const enhancements = await storage.getRecentEnhancements(limit);
      res.json(enhancements);
    } catch (error) {
      console.error('Get recent enhancements error:', error);
      res.status(500).json({ message: 'Failed to get recent enhancements' });
    }
  });

  // Clear completed enhancements
  app.delete('/api/enhancements/clear-completed', async (req, res) => {
    try {
      const deletedCount = await storage.clearCompletedEnhancements();
      res.json({ 
        message: `Cleared ${deletedCount} completed enhancements from storage`,
        deletedCount 
      });
    } catch (error) {
      console.error('Clear completed enhancements error:', error);
      res.status(500).json({ message: 'Failed to clear completed enhancements' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
