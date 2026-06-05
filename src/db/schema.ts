import { pgTable, serial, text, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";

// ── SMS Subscribers ──
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
  keyword: varchar("keyword", { length: 20 }).notNull().default("SOUL"),
  // TCPA/CTIA compliance
  consentAt: timestamp("consent_at").notNull().defaultNow(),
  consentSource: varchar("consent_source", { length: 50 }).notNull().default("web_form"),
  optOut: boolean("opt_out").notNull().default(false),
  optOutAt: timestamp("opt_out_at"),
  promoCode: varchar("promo_code", { length: 20 }).default("SOUL10"),
  promoRedeemed: boolean("promo_redeemed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// ── SMS Messages (sent & simulated) ──
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  subscriberId: integer("subscriber_id").references(() => subscribers.id),
  direction: varchar("direction", { length: 10 }).notNull().default("outbound"), // inbound | outbound
  fromNumber: varchar("from_number", { length: 20 }),
  toNumber: varchar("to_number", { length: 20 }),
  body: text("body").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | sent | delivered | failed | simulated
  twilioSid: varchar("twilio_sid", { length: 100 }),
  simulated: boolean("simulated").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Staff / Admin Users (references Clerk) ──
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  role: varchar("role", { length: 20 }).notNull().default("staff"), // owner | manager | staff
  email: varchar("email", { length: 255 }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Reputation / Review Tracking ──
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // google | yelp | facebook
  reviewerName: varchar("reviewer_name", { length: 100 }),
  rating: integer("rating").notNull(), // 1-5
  text: text("text"),
  replied: boolean("replied").notNull().default(false),
  replyText: text("reply_text"),
  replyTemplate: text("reply_template"),
  url: varchar("url", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Events ──
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  description: text("description"),
  href: varchar("href", { length: 500 }),
  cta: varchar("cta", { length: 100 }),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
