import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertDebtSchema, insertPaymentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Customer endpoints
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const result = insertCustomerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid customer data", details: result.error });
      }
      const customer = await storage.createCustomer(result.data);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  app.patch("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertCustomerSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid customer data", details: result.error });
      }
      const customer = await storage.updateCustomer(id, result.data);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomer(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });

  // Debt endpoints
  app.get("/api/debts", async (req, res) => {
    try {
      const debts = await storage.getDebts();
      res.json(debts);
    } catch (error) {
      console.error("Error fetching debts:", error);
      res.status(500).json({ error: "Failed to fetch debts" });
    }
  });

  app.get("/api/debts/overdue", async (req, res) => {
    try {
      const debts = await storage.getOverdueDebts();
      res.json(debts);
    } catch (error) {
      console.error("Error fetching overdue debts:", error);
      res.status(500).json({ error: "Failed to fetch overdue debts" });
    }
  });

  app.get("/api/debts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const debt = await storage.getDebt(id);
      if (!debt) {
        return res.status(404).json({ error: "Debt not found" });
      }
      res.json(debt);
    } catch (error) {
      console.error("Error fetching debt:", error);
      res.status(500).json({ error: "Failed to fetch debt" });
    }
  });

  app.post("/api/debts", async (req, res) => {
    try {
      const result = insertDebtSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid debt data", details: result.error });
      }
      const debt = await storage.createDebt(result.data);
      res.status(201).json(debt);
    } catch (error) {
      console.error("Error creating debt:", error);
      res.status(500).json({ error: "Failed to create debt" });
    }
  });

  app.patch("/api/debts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertDebtSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid debt data", details: result.error });
      }
      const debt = await storage.updateDebt(id, result.data);
      res.json(debt);
    } catch (error) {
      console.error("Error updating debt:", error);
      res.status(500).json({ error: "Failed to update debt" });
    }
  });

  app.patch("/api/debts/:id/archive", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const debt = await storage.archiveDebt(id);
      res.json(debt);
    } catch (error) {
      console.error("Error archiving debt:", error);
      res.status(500).json({ error: "Failed to archive debt" });
    }
  });

  app.delete("/api/debts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDebt(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting debt:", error);
      res.status(500).json({ error: "Failed to delete debt" });
    }
  });

  // Payment endpoints
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const result = insertPaymentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid payment data", details: result.error });
      }

      // Validate payment amount doesn't exceed remaining debt
      const debt = await storage.getDebt(result.data.qarzId);
      if (!debt) {
        return res.status(404).json({ error: "Debt not found" });
      }

      const remaining = Number(debt.umumiySumma) - Number(debt.tolanganSumma);
      if (Number(result.data.summa) > remaining) {
        return res.status(400).json({ 
          error: "Payment amount exceeds remaining debt",
          remaining: remaining.toString()
        });
      }

      const payment = await storage.createPayment(result.data);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
