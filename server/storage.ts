import { users, animeCards, type User, type InsertUser, type AnimeCard, type InsertAnimeCard } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCard(id: number): Promise<AnimeCard | undefined>;
  getCardsByUserId(userId: number): Promise<AnimeCard[]>;
  createCard(card: InsertAnimeCard & { userId: number }): Promise<AnimeCard>;
  updateCard(id: number, card: Partial<InsertAnimeCard>): Promise<AnimeCard | undefined>;
  deleteCard(id: number): Promise<boolean>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

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

  async getCard(id: number): Promise<AnimeCard | undefined> {
    const [card] = await db.select().from(animeCards).where(eq(animeCards.id, id));
    return card || undefined;
  }

  async getCardsByUserId(userId: number): Promise<AnimeCard[]> {
    return await db
      .select()
      .from(animeCards)
      .where(eq(animeCards.userId, userId))
      .orderBy(desc(animeCards.createdAt));
  }

  async createCard(card: InsertAnimeCard & { userId: number }): Promise<AnimeCard> {
    const [newCard] = await db
      .insert(animeCards)
      .values(card)
      .returning();
    return newCard;
  }

  async updateCard(id: number, card: Partial<InsertAnimeCard>): Promise<AnimeCard | undefined> {
    const [updatedCard] = await db
      .update(animeCards)
      .set({ ...card, updatedAt: new Date() })
      .where(eq(animeCards.id, id))
      .returning();
    return updatedCard || undefined;
  }

  async deleteCard(id: number): Promise<boolean> {
    const result = await db
      .delete(animeCards)
      .where(eq(animeCards.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
