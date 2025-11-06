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
import { insertCustomerSchema, type Customer, type InsertCustomer } from "@shared/schema";

interface CustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDialog({ customer, open, onOpenChange }: CustomerDialogProps) {
  const { toast } = useToast();
  const isEdit = !!customer;

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      ism: "",
      telefon: "",
      manzil: "",
      izoh: "",
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        ism: customer.ism,
        telefon: customer.telefon,
        manzil: customer.manzil || "",
        izoh: customer.izoh || "",
      });
    } else {
      form.reset({
        ism: "",
        telefon: "",
        manzil: "",
        izoh: "",
      });
    }
  }, [customer, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      if (isEdit) {
        return apiRequest("PATCH", `/api/customers/${customer.id}`, data);
      }
      return apiRequest("POST", "/api/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Muvaffaqiyat",
        description: isEdit ? "Mijoz ma'lumotlari yangilandi" : "Yangi mijoz qo'shildi",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mijozni saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Mijozni tahrirlash" : "Yangi mijoz qo'shish"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ism</FormLabel>
                  <FormControl>
                    <Input placeholder="Mijoz ismi" {...field} data-testid="input-customer-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon raqami</FormLabel>
                  <FormControl>
                    <Input placeholder="+998 90 123 45 67" {...field} data-testid="input-customer-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manzil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manzil (ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Input placeholder="Manzil" {...field} data-testid="input-customer-address" />
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
                      data-testid="input-customer-note"
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
                data-testid="button-cancel-customer"
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={mutation.isPending} data-testid="button-save-customer">
                {mutation.isPending ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
