// Types
export interface User {
    id: number;
    telefon: string;
    ism: string;
    rol: string;
    faol: boolean;
    yaratilganSana: Date;
}

export interface Customer {
    id: number;
    ism: string;
    telefon: string;
    manzil: string | null;
    izoh: string | null;
    faol: boolean;
    yaratilganSana: Date;
}

export interface Debt {
    id: number;
    mijozId: number;
    tovarNomi: string;
    umumiySumma: string;
    tolanganSumma: string;
    berilganSana: Date;
    qaytarishMuddati: Date;
    holati: string;
    arxivlangan: boolean;
    yaratilganSana: Date;
}

export interface Payment {
    id: number;
    qarzId: number;
    summa: string;
    tolovSanasi: Date;
    izoh: string | null;
}

export interface DebtWithCustomer extends Debt {
    mijoz: Customer;
    tolovlar: Payment[];
}

// Insert types
export interface InsertCustomer {
    ism: string;
    telefon: string;
    manzil?: string | null;
    izoh?: string | null;
}

export interface InsertDebt {
    mijozId: number;
    tovarNomi: string;
    umumiySumma: string | number;
    berilganSana: string | Date;
    qaytarishMuddati: string | Date;
}

export interface InsertPayment {
    qarzId: number;
    summa: string | number;
    izoh?: string | null;
}
