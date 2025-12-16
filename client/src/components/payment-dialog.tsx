import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertPaymentSchema } from "@/lib/validators";
import type { DebtWithCustomer, InsertPayment } from "@/types";

interface PaymentDialogProps {
  debt: DebtWithCustomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({ debt, open, onOpenChange }: PaymentDialogProps) {
  const { toast } = useToast();

  const form = useForm<InsertPayment>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues: {
      qarzId: 0,
      summa: "",
      izoh: "",
    },
  });

  useEffect(() => {
    if (debt) {
      const remaining = Number(debt.umumiySumma) - Number(debt.tolanganSumma);
      form.reset({
        qarzId: debt.id,
        summa: remaining.toString(),
        izoh: "",
      });
    }
  }, [debt, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertPayment) => {
      return apiRequest("POST", "/api/payments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Muvaffaqiyat",
        description: "To'lov qo'shildi",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "To'lovni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPayment) => {
    mutation.mutate(data);
  };

  if (!debt) return null;

  const remaining = Number(debt.umumiySumma) - Number(debt.tolanganSumma);
  const formatSumma = (summa: number) => {
    return new Intl.NumberFormat('uz-UZ').format(summa) + " so'm";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>To'lov qo'shish</DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mijoz:</span>
                <span className="font-medium text-foreground">{debt.mijoz.ism}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tovar:</span>
                <span className="font-medium text-foreground">{debt.tovarNomi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Umumiy summa:</span>
                <span className="font-medium text-foreground">{formatSumma(Number(debt.umumiySumma))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To'langan:</span>
                <span className="font-medium text-green-600">{formatSumma(Number(debt.tolanganSumma))}</span>
              </div>
              <div className="flex justify-between pt-1 border-t">
                <span className="text-muted-foreground">Qolgan summa:</span>
                <span className="font-bold text-foreground">{formatSumma(remaining)}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="summa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To'lov summasi (so'm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      data-testid="input-payment-amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="izoh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh (ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Qo'shimcha ma'lumot"
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                      data-testid="input-payment-note"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-payment"
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid="button-save-payment">
                {mutation.isPending ? "Qo'shilmoqda..." : "To'lov qo'shish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
