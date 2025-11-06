import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle2, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
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

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const formatSumma = (summa: number) => {
    return new Intl.NumberFormat('uz-UZ').format(summa) + " so'm";
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Bosh sahifa</h1>
        <p className="text-muted-foreground mt-1">Qarz boshqaruv tizimi statistikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate" data-testid="card-total-customers">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami mijozlar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-customers">
              {stats?.jamiMijozlar || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Faol: {stats?.faolMijozlar || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-total-debts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami qarzlar
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-debts">
              {stats?.jamiQarzlar || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Faol qarzlar soni
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-paid-debts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              To'langan
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600" data-testid="text-paid-debts">
              {stats?.tolanganQarzlar || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              To'liq to'langan qarzlar
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-overdue-debts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kechikkan
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive" data-testid="text-overdue-debts">
              {stats?.kechikkanQarzlar || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Muddati o'tgan qarzlar
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate col-span-1 md:col-span-2" data-testid="card-total-amount">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami qarz summasi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-amount">
              {formatSumma(stats?.jamiQarzSumma || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Barcha qarzlarning umumiy summasi
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-paid-amount">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              To'langan summa
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-paid-amount">
              {formatSumma(stats?.tolanganSumma || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              To'langan to'lovlar
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate" data-testid="card-remaining-amount">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qolgan summa
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground" data-testid="text-remaining-amount">
              {formatSumma(stats?.qolganSumma || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              To'lanishi kerak
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
