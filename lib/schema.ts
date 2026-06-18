import { organization, user } from "@/auth-schema";
import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

export const labelsTable = pgTable("labels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 255 }),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const artistsTable = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  logo: varchar("logo"),
  dsp_connections: jsonb("dsp_connections").default([]), 
  social_connections: jsonb("social_connections").default([]),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const releasesTable = pgTable("releases", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  version: varchar("version"),
  upc: integer("upc"),
  artists: jsonb("artists").$type<
    {
      id: number;
      name: string;
      role: string;
      isMain: boolean;
    }[]
  >(),
  status: varchar("status"),
  artwork: varchar("artwork"),
  label: integer("label").references(() => labelsTable.id),
  primaryGenre: text("primary_genre"),
  secondaryGenre: text("secondary_genre"),
  releaseDate: text("release_date"),
  originalReleaseDate: text("original_release_date"),
  language: text("language"),
  previouslyReleased: boolean().default(false),
  stores: text("stores").array(),
  reason: text("reason"),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ChatMessage = {
  userId: string;
  message: string;
  timestamp: string;
};

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  chats: jsonb("chats").$type<ChatMessage[]>().default([]).notNull(),
  status: varchar("status").default("pending").notNull(),
  createdBy: text("created_by")
    .references(() => user.id)
    .notNull(),
  organizationId: text("organization_id")
    .references(() => organization.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// export const labelsRelations = relations(labelsTable, ({ one }) => ({
//   creator: one(user, {
//     fields: [labelsTable.createdBy],
//     references: [user.id],
//   }),

//   organization: one(organization, {
//     fields: [labelsTable.organizationId],
//     references: [organization.id],
//   }),
// }));