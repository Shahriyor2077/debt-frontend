import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, DollarSign, Archive, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DebtDialog } from "@/components/debt-dialog";
import { PaymentDialog } from "@/components/payment-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { DebtWithCustomer } from "@shared/schema";
import { format, isPast } from "date-fns";

export default function Debts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDebt, setSelectedDebt] = useState<DebtWithCustomer | null>(null);
  const [isDebtDialogOpen, setIsDebtDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: debts, isLoading } = useQuery<DebtWithCustomer[]>({
    queryKey: ["/api/debts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/debts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Muvaffaqiyat",
        description: "Qarz o'chirildi",
      });
      setIsDeleteDialogOpen(false);
      setSelectedDebt(null);
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Qarzni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/debts/${id}/archive`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Muvaffaqiyat",
        description: "Qarz arxivlandi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Qarzni arxivlashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const filteredDebts = debts?.filter((debt) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      debt.tovarNomi.toLowerCase().includes(query) ||
      debt.mijoz.ism.toLowerCase().includes(query) ||
      debt.mijoz.telefon.toLowerCase().includes(query);

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && debt.holati === statusFilter;
  });

  const handleEdit = (debt: DebtWithCustomer) => {
    setSelectedDebt(debt);
    setIsDebtDialogOpen(true);
  };

  const handlePayment = (debt: DebtWithCustomer) => {
    setSelectedDebt(debt);
    setIsPaymentDialogOpen(true);
  };

  const handleDelete = (debt: DebtWithCustomer) => {
    setSelectedDebt(debt);
    setIsDeleteDialogOpen(true);
  };

  const handleArchive = (debt: DebtWithCustomer) => {
    archiveMutation.mutate(debt.id);
  };

  const handleAdd = () => {
    setSelectedDebt(null);
    setIsDebtDialogOpen(true);
  };

  const formatSumma = (summa: string | number) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(summa)) + " so'm";
  };

  const getStatusBadge = (debt: DebtWithCustomer) => {
    const isOverdue = isPast(new Date(debt.qaytarishMuddati)) && debt.holati !== "to'langan";

    if (debt.holati === "to'langan") {
      return <Badge variant="default" className="bg-green-600">To'langan</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Kechikkan</Badge>;
    }
    if (debt.holati === "qisman") {
      return <Badge variant="secondary" className="bg-yellow-600 text-white">Qisman</Badge>;
    }
    return <Badge variant="outline">To'lanmagan</Badge>;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Qarzlar</h1>
          <p className="text-muted-foreground mt-1">Barcha qarzlar ro'yxati</p>
        </div>
        <Button onClick={handleAdd} data-testid="button-add-debt">
          <Plus className="h-4 w-4 mr-2" />
          Yangi qarz
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tovar, mijoz yoki telefon bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-debts"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48" data-testid="select-debt-status">
            <SelectValue placeholder="Holatni tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha holatlar</SelectItem>
            <SelectItem value="to'lanmagan">To'lanmagan</SelectItem>
            <SelectItem value="qisman">Qisman to'langan</SelectItem>
            <SelectItem value="to'langan">To'langan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !filteredDebts || filteredDebts.length === 0 ? (
          <div className="p-12 text-center" data-testid="empty-state-debts">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery || statusFilter !== "all" ? "Qarzlar topilmadi" : "Hali qarzlar yo'q"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Filtrlarni o'zgartiring yoki boshqa qidiruv so'zini kiriting"
                : "Yangi qarz qo'shish uchun yuqoridagi tugmani bosing"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={handleAdd} data-testid="button-add-first-debt">
                <Plus className="h-4 w-4 mr-2" />
                Birinchi qarzni qo'shish
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mijoz</TableHead>
                <TableHead>Tovar</TableHead>
                <TableHead>Umumiy summa</TableHead>
                <TableHead>To'langan</TableHead>
                <TableHead>Qolgan</TableHead>
                <TableHead>Muddat</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebts.map((debt) => {
                const remaining = Number(debt.umumiySumma) - Number(debt.tolanganSumma);
                return (
                  <TableRow key={debt.id} data-testid={`row-debt-${debt.id}`}>
                    <TableCell className="font-medium" data-testid={`text-debt-customer-${debt.id}`}>
                      {debt.mijoz.ism}
                    </TableCell>
                    <TableCell data-testid={`text-debt-product-${debt.id}`}>
                      {debt.tovarNomi}
                    </TableCell>
                    <TableCell>{formatSumma(debt.umumiySumma)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatSumma(debt.tolanganSumma)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatSumma(remaining)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(debt.qaytarishMuddati), "dd.MM.yyyy")}
                    </TableCell>
                    <TableCell data-testid={`badge-debt-status-${debt.id}`}>
                      {getStatusBadge(debt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePayment(debt)}
                          disabled={debt.holati === "to'langan"}
                          data-testid={`button-pay-debt-${debt.id}`}
                        >
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(debt)}
                          data-testid={`button-edit-debt-${debt.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {debt.holati === "to'langan" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleArchive(debt)}
                            data-testid={`button-archive-debt-${debt.id}`}
                          >
                            <Archive className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(debt)}
                          data-testid={`button-delete-debt-${debt.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <DebtDialog
        debt={selectedDebt}
        open={isDebtDialogOpen}
        onOpenChange={setIsDebtDialogOpen}
      />

      <PaymentDialog
        debt={selectedDebt}
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedDebt && deleteMutation.mutate(selectedDebt.id)}
        title="Qarzni o'chirish"
        description={`${selectedDebt?.tovarNomi} qarzini o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
