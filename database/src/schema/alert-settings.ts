import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const alertSettingsTable = pgTable("alert_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  daily: boolean("daily").notNull().default(true),
  weekly: boolean("weekly").notNull().default(false),
  monthly: boolean("monthly").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AlertSettings = typeof alertSettingsTable.$inferSelect;
