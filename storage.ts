import { type User, type InsertUser, users, chatMessages, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { eq, asc, desc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat methods
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatHistory(userId: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  private db;
  public sessionStore: session.Store;
  private pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
    });
    this.db = drizzle(this.pool);
    this.sessionStore = new PostgresSessionStore({ 
      pool: this.pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async getChatMessages(userId: number, limit: number = 50): Promise<ChatMessage[]> {
    const messages = await this.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
    
    return messages.reverse();
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await this.db.insert(chatMessages).values(message).returning();
    return chatMessage;
  }

  async clearChatHistory(userId: number): Promise<void> {
    await this.db.delete(chatMessages).where(eq(chatMessages.userId, userId));
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: ChatMessage[];
  private idCounter: number;
  private messageIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.messages = [];
    this.idCounter = 1;
    this.messageIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.idCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatMessages(userId: number, limit: number = 50): Promise<ChatMessage[]> {
    return this.messages
      .filter(m => m.userId === userId)
      .slice(-limit);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      ...message,
      id: this.messageIdCounter++,
      createdAt: new Date(),
    };
    this.messages.push(chatMessage);
    return chatMessage;
  }

  async clearChatHistory(userId: number): Promise<void> {
    this.messages = this.messages.filter(m => m.userId !== userId);
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
