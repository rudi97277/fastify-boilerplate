import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;
