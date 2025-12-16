import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import Debts from "@/pages/debts";
import Payments from "@/pages/payments";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  if (!isAuthenticated()) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/mijozlar">
        {() => <ProtectedRoute component={Customers} />}
      </Route>
      <Route path="/qarzlar">
        {() => <ProtectedRoute component={Debts} />}
      </Route>
      <Route path="/tolovlar">
        {() => <ProtectedRoute component={Payments} />}
      </Route>
      <Route path="/hisobotlar">
        {() => <ProtectedRoute component={Reports} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="qarz-theme">
        <TooltipProvider>
          {isLoginPage ? (
            // Login sahifasi - sidebar yo'q
            <>
              <Router />
              <Toaster />
            </>
          ) : (
            // Boshqa sahifalar - sidebar bilan
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <header className="flex items-center justify-between h-16 px-4 border-b bg-background">
                    <div className="flex items-center">
                      <SidebarTrigger data-testid="button-sidebar-toggle" />
                      <div className="ml-4">
                        <h1 className="text-lg font-semibold text-foreground">Qarz Boshqaruvi</h1>
                      </div>
                    </div>
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 overflow-auto bg-background">
                    <Router />
                  </main>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
