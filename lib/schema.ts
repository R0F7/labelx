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

// export const releasesTable = pgTable("releases", {
//   id: serial("id").primaryKey(),
//   title: varchar("title").notNull(),
//   version: varchar("version"),
//   upc: integer("upc"),
//   artists: jsonb("artists").$type<
//     {
//       id: number;
//       name: string;
//       role: string;
//       isMain: boolean;
//     }[]
//   >(),
//   status: varchar("status"),
//   artwork: varchar("artwork"),
//   label: integer("label").references(() => labelsTable.id),
//   primaryGenre: text("primary_genre"),
//   secondaryGenre: text("secondary_genre"),
//   releaseDate: text("release_date"),
//   originalReleaseDate: text("original_release_date"),
//   language: text("language"),
//   previouslyReleased: boolean().default(false),
//   stores: text("stores").array(),
//   reason: text("reason"),
//   createdBy: text("created_by")
//     .references(() => user.id)
//     .notNull(),
//   organizationId: text("organization_id")
//     .references(() => organization.id)
//     .notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

export const releasesTable = pgTable("releases", {
  id: serial("id").primaryKey(),
  releaseType: varchar("release_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  version: varchar("version", { length: 255 }),
  upc: varchar("upc", { length: 20 }),
  artwork: varchar("artwork", { length: 255 }).notNull(),
  artists: jsonb("artists").$type<
    {
      artistType: string;
      artistData: {
        id: string;
        name: string;
      };
    }[]
  >(),
  primaryGenre: varchar("primary_genre", { length: 100 }).notNull(),
  secondaryGenre: varchar("secondary_genre", { length: 100 }),
  language: varchar("language", { length: 100 }).notNull(),
  releaseDate: timestamp("release_date").notNull(),
  originalReleaseDate: timestamp("original_release_date").notNull(),
  labelId: integer("label_id")
    .references(() => labelsTable.id)
    .notNull(),
  stores: text("stores").array().default([]),
  status: varchar("status", {
    length: 50,
  })
    .default("draft")
    .notNull(),
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

export const releaseTracksTable = pgTable("release_tracks", {
  id: serial("id").primaryKey(),
  releaseId: integer("release_id")
    .references(() => releasesTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  trackNumber: integer("track_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  version: varchar("version", { length: 255 }),
  audioFile: varchar("audio_file", {
    length: 255,
  }).notNull(),
  audioHash: varchar("audio_hash", {
    length: 255,
  }),
  duration: integer("duration"),
  isrc: varchar("isrc", {
    length: 20,
  }).notNull(),
  artists: jsonb("artists").$type<
    {
      artistType: string;
      artistData: {
        id: string;
        name: string;
      };
    }[]
  >(),
  primaryGenre: varchar("primary_genre", {
    length: 100,
  }).notNull(),
  secondaryGenre: varchar("secondary_genre", {
    length: 100,
  }),
  trackOrigin: varchar("track_origin", {
    length: 100,
  }).notNull(),
  explicitContent: varchar("explicit_content", {
    length: 50,
  }).notNull(),
  trackLanguage: varchar("track_language", {
    length: 100,
  }).notNull(),
  isInstrumental: boolean("is_instrumental").default(false).notNull(),
  previewStart: integer("preview_start"),
  writers: jsonb("writers").$type<
    {
      role: string;
      name: string;
    }[]
  >(),
  //   status: varchar("status", {
  //   length: 50,
  // })
  //   .default("draft")
  //   .notNull(),
  //   createdBy: text("created_by")
  //   .references(() => user.id)
  //   .notNull(),
  // organizationId: text("organization_id")
  //   .references(() => organization.id)
  //   .notNull(),
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

export const releasesRelations = relations(releasesTable, ({ many, one }) => ({
  tracks: many(releaseTracksTable),

  label: one(labelsTable, {
    fields: [releasesTable.labelId],
    references: [labelsTable.id],
  }),
}));

export const releaseTracksRelations = relations(
  releaseTracksTable,
  ({ one }) => ({
    release: one(releasesTable, {
      fields: [releaseTracksTable.releaseId],
      references: [releasesTable.id],
    }),
  }),
);
