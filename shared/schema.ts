import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const animeCards = pgTable("anime_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // character, spell, artifact, summon
  rarity: text("rarity").notNull(), // common, rare, legendary
  attack: integer("attack").default(0),
  defense: integer("defense").default(0),
  health: integer("health").default(0),
  mana: integer("mana").default(0),
  description: text("description"),
  imageUrl: text("image_url"),
  abilities: text("abilities").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  cards: many(animeCards),
}));

export const cardRelations = relations(animeCards, ({ one }) => ({
  user: one(users, {
    fields: [animeCards.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAnimeCardSchema = createInsertSchema(animeCards).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnimeCard = z.infer<typeof insertAnimeCardSchema>;
export type AnimeCard = typeof animeCards.$inferSelect;
