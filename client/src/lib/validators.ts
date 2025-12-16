import { z } from "zod";

export const insertCustomerSchema = z.object({
    ism: z.string().min(1, "Ism kiritilishi shart"),
    telefon: z.string().min(1, "Telefon raqami kiritilishi shart"),
    manzil: z.string().optional().nullable(),
    izoh: z.string().optional().nullable(),
});

export const insertDebtSchema = z.object({
    mijozId: z.number(),
    tovarNomi: z.string().min(1, "Tovar nomi kiritilishi shart"),
    umumiySumma: z.string().or(z.number()),
    berilganSana: z.string().or(z.date()),
    qaytarishMuddati: z.string().or(z.date()),
});

export const insertPaymentSchema = z.object({
    qarzId: z.number(),
    summa: z.string().or(z.number()),
    izoh: z.string().optional().nullable(),
});
