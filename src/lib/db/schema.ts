//file to store table definations

import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"; //pg-core contains utilites from postrges databse(int,pgtable,etc)

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]); //mapping within the database itself,system-gpt

//we have 3 major fields-ChatTitiles,URLs,ChatWindow
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userID: varchar("user_id", { length: 256 }).notNull(), //pointing to clerk userID
  fileKey: text("file_key").notNull(), //to retrive files from AWS S3 bucket
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(), //refrences is taking a callback function and returns ChatID-foreign key refrence
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(), //either user or system,so we create enum above
});
