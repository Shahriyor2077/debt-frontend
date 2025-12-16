import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertDebtSchema } from "@/lib/validators";
import type { DebtWithCustomer, InsertDebt, Customer } from "@/types";
import { format } from "date-fns";

interface DebtDialogProps {
  debt: DebtWithCustomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DebtDialog({ debt, open, onOpenChange }: DebtDialogProps) {
  const { toast } = useToast();
  const isEdit = !!debt;

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const form = useForm<InsertDebt>({
    resolver: zodResolver(insertDebtSchema),
    defaultValues: {
      mijozId: 0,
      tovarNomi: "",
      umumiySumma: "",
      berilganSana: new Date().toISOString(),
      qaytarishMuddati: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (debt) {
      form.reset({
        mijozId: debt.mijozId,
        tovarNomi: debt.tovarNomi,
        umumiySumma: debt.umumiySumma,
        berilganSana: debt.berilganSana,
        qaytarishMuddati: debt.qaytarishMuddati,
      });
    } else {
      form.reset({
        mijozId: 0,
        tovarNomi: "",
        umumiySumma: "",
        berilganSana: new Date().toISOString(),
        qaytarishMuddati: new Date().toISOString(),
      });
    }
  }, [debt, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertDebt) => {
      if (isEdit) {
        return apiRequest("PATCH", `/api/debts/${debt.id}`, data);
      }
      return apiRequest("POST", "/api/debts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Muvaffaqiyat",
        description: isEdit ? "Qarz ma'lumotlari yangilandi" : "Yangi qarz qo'shildi",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Qarzni saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDebt) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Qarzni tahrirlash" : "Yangi qarz qo'shish"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mijozId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mijoz</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-debt-customer">
                        <SelectValue placeholder="Mijozni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers?.filter(c => c.faol).map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.ism} - {customer.telefon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tovarNomi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tovar nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Tovar nomi" {...field} data-testid="input-debt-product" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="umumiySumma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Umumiy summa (so'm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      {...field}
                      data-testid="input-debt-amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="berilganSana"
              render={({ field }) => {
                const dateValue = field.value ? (() => {
                  try {
                    const date = new Date(field.value);
                    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
                  } catch {
                    return "";
                  }
                })() : "";

                return (
                  <FormItem>
                    <FormLabel>Berilgan sana</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={dateValue}
                        onChange={(e) => {
                          if (e.target.value) {
                            field.onChange(new Date(e.target.value).toISOString());
                          }
                        }}
                        data-testid="input-debt-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="qaytarishMuddati"
              render={({ field }) => {
                const dateValue = field.value ? (() => {
                  try {
                    const date = new Date(field.value);
                    return isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
                  } catch {
                    return "";
                  }
                })() : "";

                return (
                  <FormItem>
                    <FormLabel>Qaytarish muddati</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={dateValue}
                        onChange={(e) => {
                          if (e.target.value) {
                            field.onChange(new Date(e.target.value).toISOString());
                          }
                        }}
                        data-testid="input-debt-deadline"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-debt"
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid="button-save-debt">
                {mutation.isPending ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
