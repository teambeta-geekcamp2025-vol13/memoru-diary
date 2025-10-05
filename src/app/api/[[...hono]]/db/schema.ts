import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  doublePrecision,
  smallint,
  unique,
  date,
} from "drizzle-orm/pg-core";

// users
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  account_id: text().unique(),
  google_id: uuid(),
  name: text().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// diaries
export const diaries = pgTable("diaries", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text().notNull(),
  text: text().notNull(),
  readed: boolean().notNull().default(false),
  life_record_id: uuid()
    .notNull()
    .references(() => life_records.id, { onDelete: "cascade" }),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// life_records
export const life_records = pgTable("life_records", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ai_created: boolean().default(false),
  record_date: date().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// record_images
export const record_images = pgTable("record_images", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  life_record_id: uuid()
    .notNull()
    .references(() => life_records.id, { onDelete: "cascade" }),
  url: text(),
  description: text(),
  to_text: text(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// record_texts
export const record_texts = pgTable("record_texts", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  life_record_id: uuid()
    .notNull()
    .references(() => life_records.id, { onDelete: "cascade" }),
  text: text().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// record_positions
export const record_positions = pgTable("record_positions", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  life_record_id: uuid()
    .notNull()
    .references(() => life_records.id, { onDelete: "cascade" }),
  latitude: doublePrecision().notNull(),
  longitude: doublePrecision().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// record_browsers
export const record_browsers = pgTable("record_browsers", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  life_record_id: uuid()
    .notNull()
    .references(() => life_records.id, { onDelete: "cascade" }),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
// follows
export const follows = pgTable(
  "follows",
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    follower_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    following_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    follow_account_unique: unique().on(table.follower_id, table.following_id),
  }),
);

// follow_requests
export const follow_requests = pgTable(
  "follow_requests",
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    send_user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receive_user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    allow: smallint().notNull().default(0), // 0: requesting, 1: permission, 2: rejection
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    follow_account_unique: unique().on(
      table.send_user_id,
      table.receive_user_id,
    ),
  }),
);

// tags
export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: text().notNull().unique(),
  url: text().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// diary_to_tags
export const diary_to_tags = pgTable("diary_to_tags", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  diary_id: uuid()
    .notNull()
    .references(() => diaries.id, { onDelete: "cascade" }),
  tag_id: uuid()
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// likes
export const likes = pgTable(
  "likes",
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    diary_id: uuid()
      .notNull()
      .references(() => diaries.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    like_unique: unique().on(table.diary_id, table.user_id),
  }),
);
