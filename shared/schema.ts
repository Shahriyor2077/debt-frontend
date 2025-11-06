import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Mijozlar (Customers) table
export const customers = pgTable("customers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ism: text("ism").notNull(),
  telefon: varchar("telefon", { length: 20 }).notNull(),
  manzil: text("manzil"),
  izoh: text("izoh"),
  faol: boolean("faol").notNull().default(true), // soft delete flag
  yaratilganSana: timestamp("yaratilgan_sana").notNull().defaultNow(),
});

// Qarzlar (Debts) table
export const debts = pgTable("debts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  mijozId: integer("mijoz_id").notNull().references(() => customers.id),
  tovarNomi: text("tovar_nomi").notNull(),
  umumiySumma: decimal("umumiy_summa", { precision: 12, scale: 2 }).notNull(),
  tolanganSumma: decimal("tolangan_summa", { precision: 12, scale: 2 }).notNull().default("0"),
  berilganSana: timestamp("berilgan_sana").notNull().defaultNow(),
  qaytarishMuddati: timestamp("qaytarish_muddati").notNull(),
  holati: varchar("holati", { length: 20 }).notNull().default("to'lanmagan"), // to'lanmagan, qisman, to'langan
  arxivlangan: boolean("arxivlangan").notNull().default(false),
  yaratilganSana: timestamp("yaratilgan_sana").notNull().defaultNow(),
});

// To'lovlar (Payments) table
export const payments = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  qarzId: integer("qarz_id").notNull().references(() => debts.id),
  summa: decimal("summa", { precision: 12, scale: 2 }).notNull(),
  tolovSanasi: timestamp("tolov_sanasi").notNull().defaultNow(),
  izoh: text("izoh"),
});

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  qarzlar: many(debts),
}));

export const debtsRelations = relations(debts, ({ one, many }) => ({
  mijoz: one(customers, {
    fields: [debts.mijozId],
    references: [customers.id],
  }),
  tolovlar: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  qarz: one(debts, {
    fields: [payments.qarzId],
    references: [debts.id],
  }),
}));

// Insert schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  yaratilganSana: true,
  faol: true,
});

export const insertDebtSchema = createInsertSchema(debts).omit({
  id: true,
  yaratilganSana: true,
  tolanganSumma: true,
  holati: true,
  arxivlangan: true,
}).extend({
  berilganSana: z.string().or(z.date()),
  qaytarishMuddati: z.string().or(z.date()),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  tolovSanasi: true,
});

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Debt = typeof debts.$inferSelect;
export type InsertDebt = z.infer<typeof insertDebtSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Extended types for API responses with relations
export type CustomerWithDebts = Customer & {
  qarzlar: Debt[];
};

export type DebtWithCustomer = Debt & {
  mijoz: Customer;
  tolovlar: Payment[];
};

export type DebtWithRelations = Debt & {
  mijoz: Customer;
  tolovlar: Payment[];
};
