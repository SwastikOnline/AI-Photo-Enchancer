import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const enhancements = pgTable("enhancements", {
  id: serial("id").primaryKey(),
  originalFilename: text("original_filename").notNull(),
  originalPath: text("original_path").notNull(),
  enhancedPath: text("enhanced_path"),
  enhancementType: text("enhancement_type").notNull(), // 'upscale', 'denoise', 'sharpen', 'restore'
  status: text("status").notNull().default("processing"), // 'processing', 'completed', 'failed'
  processingTime: real("processing_time"), // in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id"), // optional for guest users
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEnhancementSchema = createInsertSchema(enhancements).pick({
  originalFilename: true,
  originalPath: true,
  enhancementType: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Enhancement = typeof enhancements.$inferSelect;
export type InsertEnhancement = z.infer<typeof insertEnhancementSchema>;
