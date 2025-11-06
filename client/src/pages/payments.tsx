import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface PaymentWithDetails {
  id: number;
  summa: string;
  tolovSanasi: string;
  izoh: string | null;
  qarz: {
    id: number;
    tovarNomi: string;
    mijoz: {
      ism: string;
      telefon: string;
    };
  };
}

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: payments, isLoading } = useQuery<PaymentWithDetails[]>({
    queryKey: ["/api/payments"],
  });

  const filteredPayments = payments?.filter((payment) => {
    const query = searchQuery.toLowerCase();
    return (
      payment.qarz.tovarNomi.toLowerCase().includes(query) ||
      payment.qarz.mijoz.ism.toLowerCase().includes(query) ||
      payment.qarz.mijoz.telefon.toLowerCase().includes(query)
    );
  });

  const formatSumma = (summa: string | number) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(summa)) + " so'm";
  };

  const totalPayments = filteredPayments?.reduce((sum, payment) => sum + Number(payment.summa), 0) || 0;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">To'lovlar</h1>
          <p className="text-muted-foreground mt-1">Barcha to'lovlar tarixi</p>
        </div>
        {filteredPayments && filteredPayments.length > 0 && (
          <Card className="px-6 py-3">
            <div className="text-sm text-muted-foreground">Jami to'lovlar</div>
            <div className="text-2xl font-bold text-green-600" data-testid="text-total-payments">
              {formatSumma(totalPayments)}
            </div>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tovar yoki mijoz bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-payments"
          />
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !filteredPayments || filteredPayments.length === 0 ? (
          <div className="p-12 text-center" data-testid="empty-state-payments">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "To'lovlar topilmadi" : "Hali to'lovlar yo'q"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Boshqa so'z bilan qidirishni sinab ko'ring"
                : "Qarzlar bo'limida to'lovlarni qo'shing"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mijoz</TableHead>
                <TableHead>Tovar</TableHead>
                <TableHead>To'lov summasi</TableHead>
                <TableHead>To'lov sanasi</TableHead>
                <TableHead>Izoh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                  <TableCell className="font-medium" data-testid={`text-payment-customer-${payment.id}`}>
                    {payment.qarz.mijoz.ism}
                  </TableCell>
                  <TableCell data-testid={`text-payment-product-${payment.id}`}>
                    {payment.qarz.tovarNomi}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatSumma(payment.summa)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(payment.tolovSanasi), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.izoh || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
