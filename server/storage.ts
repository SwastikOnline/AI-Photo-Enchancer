import { users, enhancements, type User, type InsertUser, type Enhancement, type InsertEnhancement } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEnhancement(enhancement: InsertEnhancement): Promise<Enhancement>;
  getEnhancement(id: number): Promise<Enhancement | undefined>;
  updateEnhancement(id: number, updates: Partial<Enhancement>): Promise<Enhancement | undefined>;
  getRecentEnhancements(limit?: number): Promise<Enhancement[]>;
  clearCompletedEnhancements(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private enhancements: Map<number, Enhancement>;
  private currentUserId: number;
  private currentEnhancementId: number;

  constructor() {
    this.users = new Map();
    this.enhancements = new Map();
    this.currentUserId = 1;
    this.currentEnhancementId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEnhancement(insertEnhancement: InsertEnhancement): Promise<Enhancement> {
    const id = this.currentEnhancementId++;
    const enhancement: Enhancement = {
      ...insertEnhancement,
      id,
      enhancedPath: null,
      status: "processing",
      processingTime: null,
      createdAt: new Date(),
      userId: insertEnhancement.userId || null,
    };
    this.enhancements.set(id, enhancement);
    return enhancement;
  }

  async getEnhancement(id: number): Promise<Enhancement | undefined> {
    return this.enhancements.get(id);
  }

  async updateEnhancement(id: number, updates: Partial<Enhancement>): Promise<Enhancement | undefined> {
    const enhancement = this.enhancements.get(id);
    if (enhancement) {
      const updated = { ...enhancement, ...updates };
      this.enhancements.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getRecentEnhancements(limit: number = 10): Promise<Enhancement[]> {
    return Array.from(this.enhancements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async clearCompletedEnhancements(): Promise<number> {
    const completedIds: number[] = [];
    
    this.enhancements.forEach((enhancement, id) => {
      if (enhancement.status === 'completed') {
        completedIds.push(id);
      }
    });
    
    // Remove from memory
    completedIds.forEach(id => this.enhancements.delete(id));
    
    // Clean up files
    const fs = require('fs');
    completedIds.forEach(id => {
      const enhancement = this.enhancements.get(id);
      if (enhancement?.originalPath) {
        try {
          fs.unlinkSync(enhancement.originalPath);
        } catch (error) {
          console.error(`Failed to delete original file: ${enhancement.originalPath}`, error);
        }
      }
      if (enhancement?.enhancedPath) {
        try {
          fs.unlinkSync(enhancement.enhancedPath);
        } catch (error) {
          console.error(`Failed to delete enhanced file: ${enhancement.enhancedPath}`, error);
        }
      }
    });
    
    return completedIds.length;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createEnhancement(insertEnhancement: InsertEnhancement): Promise<Enhancement> {
    const [enhancement] = await db
      .insert(enhancements)
      .values(insertEnhancement)
      .returning();
    return enhancement;
  }

  async getEnhancement(id: number): Promise<Enhancement | undefined> {
    const [enhancement] = await db.select().from(enhancements).where(eq(enhancements.id, id));
    return enhancement || undefined;
  }

  async updateEnhancement(id: number, updates: Partial<Enhancement>): Promise<Enhancement | undefined> {
    const [enhancement] = await db
      .update(enhancements)
      .set(updates)
      .where(eq(enhancements.id, id))
      .returning();
    return enhancement || undefined;
  }

  async getRecentEnhancements(limit: number = 10): Promise<Enhancement[]> {
    return await db
      .select()
      .from(enhancements)
      .orderBy(desc(enhancements.createdAt))
      .limit(limit);
  }

  async clearCompletedEnhancements(): Promise<number> {
    const fs = require('fs');
    
    // Get all completed enhancements
    const completedEnhancements = await db
      .select()
      .from(enhancements)
      .where(eq(enhancements.status, 'completed'));
    
    // Clean up files
    completedEnhancements.forEach(enhancement => {
      if (enhancement.originalPath) {
        try {
          fs.unlinkSync(enhancement.originalPath);
        } catch (error) {
          console.error(`Failed to delete original file: ${enhancement.originalPath}`, error);
        }
      }
      if (enhancement.enhancedPath) {
        try {
          fs.unlinkSync(enhancement.enhancedPath);
        } catch (error) {
          console.error(`Failed to delete enhanced file: ${enhancement.enhancedPath}`, error);
        }
      }
    });
    
    // Delete from database
    const deleteResult = await db
      .delete(enhancements)
      .where(eq(enhancements.status, 'completed'));
    
    return completedEnhancements.length;
  }
}

export const storage = new DatabaseStorage();
