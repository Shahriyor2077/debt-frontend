import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { DebtWithCustomer } from "@/types";
import { format } from "date-fns";

interface ReportStats {
  jamiMijozlar: number;
  faolMijozlar: number;
  jamiQarzlar: number;
  tolanganQarzlar: number;
  tolanmaganQarzlar: number;
  qismanTolanganQarzlar: number;
  kechikkanQarzlar: number;
  jamiQarzSumma: number;
  tolanganSumma: number;
  qolganSumma: number;
}

export default function Reports() {
  const { data: stats, isLoading: statsLoading } = useQuery<ReportStats>({
    queryKey: ["/api/stats"],
  });

  const { data: overdueDebts } = useQuery<DebtWithCustomer[]>({
    queryKey: ["/api/debts/overdue"],
  });

  const formatSumma = (summa: number | string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(summa)) + " so'm";
  };

  const getPaymentPercentage = () => {
    if (!stats || stats.jamiQarzSumma === 0) return 0;
    return Math.round((stats.tolanganSumma / stats.jamiQarzSumma) * 100);
  };

  if (statsLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Hisobotlar</h1>
        <p className="text-muted-foreground mt-1">To'liq moliyaviy hisobot va statistika</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover-elevate" data-testid="card-report-customers">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mijozlar statistikasi
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.jamiMijozlar || 0}</div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Faol mijozlar:</span>
                <span className="font-medium">{stats?.faolMijozlar || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nofaol:</span>
                <span className="font-medium">{(stats?.jamiMijozlar || 0) - (stats?.faolMijozlar || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-report-debts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qarzlar statistikasi
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.jamiQarzlar || 0}</div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">To'langan:</span>
                <span className="font-medium text-green-600">{stats?.tolanganQarzlar || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">To'lanmagan:</span>
                <span className="font-medium text-destructive">{stats?.tolanmaganQarzlar || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Qisman:</span>
                <span className="font-medium text-yellow-600">{stats?.qismanTolanganQarzlar || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-report-overdue">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kechikkan qarzlar
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats?.kechikkanQarzlar || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Muddati o'tgan qarzlar soni
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate col-span-1 md:col-span-2 lg:col-span-3" data-testid="card-report-financial">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Moliyaviy hisobot
            </CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Jami qarz summasi</div>
                <div className="text-2xl font-bold text-foreground">{formatSumma(stats?.jamiQarzSumma || 0)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">To'langan summa</div>
                <div className="text-2xl font-bold text-green-600">{formatSumma(stats?.tolanganSumma || 0)}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {getPaymentPercentage()}% to'langan
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Qolgan summa</div>
                <div className="text-2xl font-bold text-destructive">{formatSumma(stats?.qolganSumma || 0)}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  {100 - getPaymentPercentage()}% qolgan
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {overdueDebts && overdueDebts.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Kechikkan qarzlar ro'yxati</h2>
            <p className="text-sm text-muted-foreground mt-1">Muddati o'tgan to'lanmagan qarzlar</p>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mijoz</TableHead>
                  <TableHead>Tovar</TableHead>
                  <TableHead>Qarz summasi</TableHead>
                  <TableHead>To'langan</TableHead>
                  <TableHead>Qolgan</TableHead>
                  <TableHead>Muddat</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueDebts.map((debt) => {
                  const remaining = Number(debt.umumiySumma) - Number(debt.tolanganSumma);
                  return (
                    <TableRow key={debt.id} data-testid={`row-overdue-debt-${debt.id}`}>
                      <TableCell className="font-medium">{debt.mijoz.ism}</TableCell>
                      <TableCell>{debt.tovarNomi}</TableCell>
                      <TableCell>{formatSumma(debt.umumiySumma)}</TableCell>
                      <TableCell className="text-green-600">{formatSumma(debt.tolanganSumma)}</TableCell>
                      <TableCell className="font-medium text-destructive">{formatSumma(remaining)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(debt.qaytarishMuddati), "dd.MM.yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Kechikkan</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
