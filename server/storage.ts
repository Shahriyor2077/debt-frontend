// Following javascript_database blueprint integration - using DatabaseStorage
import { 
  customers, 
  debts, 
  payments,
  type Customer, 
  type InsertCustomer,
  type Debt,
  type InsertDebt,
  type Payment,
  type InsertPayment,
  type CustomerWithDebts,
  type DebtWithCustomer
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;

  // Debts
  getDebts(): Promise<DebtWithCustomer[]>;
  getDebt(id: number): Promise<DebtWithCustomer | undefined>;
  getOverdueDebts(): Promise<DebtWithCustomer[]>;
  createDebt(debt: InsertDebt): Promise<Debt>;
  updateDebt(id: number, debt: Partial<InsertDebt>): Promise<Debt>;
  deleteDebt(id: number): Promise<void>;
  archiveDebt(id: number): Promise<Debt>;

  // Payments
  getPayments(): Promise<any[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Stats
  getStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Customers
  async getCustomers(): Promise<Customer[]> {
    // Include all customers but you can filter by faol on frontend if needed
    // For now, return all to show inactive status
    return db.select().from(customers).orderBy(desc(customers.yaratilganSana));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async updateCustomer(id: number, updateData: Partial<InsertCustomer>): Promise<Customer> {
    const [customer] = await db
      .update(customers)
      .set(updateData)
      .where(eq(customers.id, id))
      .returning();
    return customer;
  }

  async deleteCustomer(id: number): Promise<void> {
    // Soft delete
    await db
      .update(customers)
      .set({ faol: false })
      .where(eq(customers.id, id));
  }

  // Debts
  async getDebts(): Promise<DebtWithCustomer[]> {
    const result = await db.query.debts.findMany({
      where: eq(debts.arxivlangan, false),
      with: {
        mijoz: true,
        tolovlar: true,
      },
      orderBy: desc(debts.yaratilganSana),
    });
    return result as DebtWithCustomer[];
  }

  async getDebt(id: number): Promise<DebtWithCustomer | undefined> {
    const result = await db.query.debts.findFirst({
      where: eq(debts.id, id),
      with: {
        mijoz: true,
        tolovlar: true,
      },
    });
    return result as DebtWithCustomer | undefined;
  }

  async getOverdueDebts(): Promise<DebtWithCustomer[]> {
    const result = await db.query.debts.findMany({
      where: and(
        eq(debts.arxivlangan, false),
        sql`${debts.qaytarishMuddati} < NOW() AND ${debts.holati} != 'to''langan'`
      ),
      with: {
        mijoz: true,
        tolovlar: true,
      },
      orderBy: debts.qaytarishMuddati,
    });
    return result as DebtWithCustomer[];
  }

  async createDebt(insertDebt: InsertDebt): Promise<Debt> {
    const [debt] = await db
      .insert(debts)
      .values(insertDebt)
      .returning();
    return debt;
  }

  async updateDebt(id: number, updateData: Partial<InsertDebt>): Promise<Debt> {
    const [debt] = await db
      .update(debts)
      .set(updateData)
      .where(eq(debts.id, id))
      .returning();
    return debt;
  }

  async deleteDebt(id: number): Promise<void> {
    await db.delete(debts).where(eq(debts.id, id));
  }

  async archiveDebt(id: number): Promise<Debt> {
    const [debt] = await db
      .update(debts)
      .set({ arxivlangan: true })
      .where(eq(debts.id, id))
      .returning();
    return debt;
  }

  // Payments
  async getPayments(): Promise<any[]> {
    const result = await db.query.payments.findMany({
      with: {
        qarz: {
          with: {
            mijoz: true,
          },
        },
      },
      orderBy: desc(payments.tolovSanasi),
    });
    return result;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();

    // Update debt status
    const debt = await this.getDebt(insertPayment.qarzId);
    if (debt) {
      const newTolangan = Number(debt.tolanganSumma) + Number(insertPayment.summa);
      const umumiy = Number(debt.umumiySumma);
      
      let holati: string;
      if (newTolangan >= umumiy) {
        holati = "to'langan";
      } else if (newTolangan > 0) {
        holati = "qisman";
      } else {
        holati = "to'lanmagan";
      }

      await db
        .update(debts)
        .set({
          tolanganSumma: newTolangan.toString(),
          holati,
        })
        .where(eq(debts.id, insertPayment.qarzId));
    }

    return payment;
  }

  // Stats
  async getStats(): Promise<any> {
    const [customerStats] = await db
      .select({
        jamiMijozlar: sql<number>`COUNT(*)::int`,
        faolMijozlar: sql<number>`COUNT(CASE WHEN ${customers.faol} = true THEN 1 END)::int`,
      })
      .from(customers);

    const [debtStats] = await db
      .select({
        jamiQarzlar: sql<number>`COUNT(*)::int`,
        tolanganQarzlar: sql<number>`COUNT(CASE WHEN ${debts.holati} = 'to''langan' THEN 1 END)::int`,
        tolanmaganQarzlar: sql<number>`COUNT(CASE WHEN ${debts.holati} = 'to''lanmagan' THEN 1 END)::int`,
        qismanTolanganQarzlar: sql<number>`COUNT(CASE WHEN ${debts.holati} = 'qisman' THEN 1 END)::int`,
        kechikkanQarzlar: sql<number>`COUNT(CASE WHEN ${debts.qaytarishMuddati} < NOW() AND ${debts.holati} != 'to''langan' THEN 1 END)::int`,
        jamiQarzSumma: sql<number>`COALESCE(SUM(CAST(${debts.umumiySumma} AS NUMERIC)), 0)::numeric`,
        tolanganSumma: sql<number>`COALESCE(SUM(CAST(${debts.tolanganSumma} AS NUMERIC)), 0)::numeric`,
      })
      .from(debts)
      .where(eq(debts.arxivlangan, false));

    return {
      ...customerStats,
      ...debtStats,
      qolganSumma: Number(debtStats.jamiQarzSumma) - Number(debtStats.tolanganSumma),
    };
  }
}

export const storage = new DatabaseStorage();
