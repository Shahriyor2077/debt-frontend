import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerDialog } from "@/components/customer-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Customer } from "@/types";
import { format } from "date-fns";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Muvaffaqiyat",
        description: "Mijoz o'chirildi",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mijozni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const filteredCustomers = customers?.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.ism.toLowerCase().includes(query) ||
      customer.telefon.toLowerCase().includes(query) ||
      customer.manzil?.toLowerCase().includes(query)
    );
  });

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Mijozlar</h1>
          <p className="text-muted-foreground mt-1">Barcha mijozlar ro'yxati</p>
        </div>
        <Button onClick={handleAdd} data-testid="button-add-customer">
          <Plus className="h-4 w-4 mr-2" />
          Yangi mijoz
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ism, telefon yoki manzil bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-customers"
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
        ) : !filteredCustomers || filteredCustomers.length === 0 ? (
          <div className="p-12 text-center" data-testid="empty-state-customers">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "Mijozlar topilmadi" : "Hali mijozlar yo'q"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Boshqa so'z bilan qidirishni sinab ko'ring"
                : "Yangi mijoz qo'shish uchun yuqoridagi tugmani bosing"}
            </p>
            {!searchQuery && (
              <Button onClick={handleAdd} data-testid="button-add-first-customer">
                <Plus className="h-4 w-4 mr-2" />
                Birinchi mijozni qo'shish
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Manzil</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Qo'shilgan sana</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                  <TableCell className="font-medium" data-testid={`text-customer-name-${customer.id}`}>
                    {customer.ism}
                  </TableCell>
                  <TableCell data-testid={`text-customer-phone-${customer.id}`}>
                    {customer.telefon}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.manzil || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.faol ? "default" : "secondary"}
                      data-testid={`badge-customer-status-${customer.id}`}
                    >
                      {customer.faol ? "Faol" : "Faol emas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(customer.yaratilganSana), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(customer)}
                        data-testid={`button-edit-customer-${customer.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(customer)}
                        data-testid={`button-delete-customer-${customer.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <CustomerDialog
        customer={selectedCustomer}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedCustomer && deleteMutation.mutate(selectedCustomer.id)}
        title="Mijozni o'chirish"
        description={`${selectedCustomer?.ism} nomli mijozni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
