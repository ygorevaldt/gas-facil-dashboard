import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame, Package, User, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Perfil", href: "/dashboard", icon: User },
    { name: "Produtos", href: "/dashboard/products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background">

      <div className="lg:hidden p-4 border-b flex items-center justify-between">
        <h1 className="font-bold text-lg">Dashboard</h1>

        <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-card border-r z-40">
        <SidebarContent
          user={user}
          logout={logout}
          navigation={navigation}
          location={location}
        />
      </aside>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r z-50 animate-slideIn">
            <SidebarContent
              user={user}
              logout={logout}
              navigation={navigation}
              location={location}
              onNavigate={() => setOpen(false)}
              mobile
            />
          </aside>
        </>
      )}

      <main className="lg:ml-64 p-4 lg:p-8">{children}</main>
    </div>
  );
}

function SidebarContent({ user, logout, navigation, location, onNavigate, mobile }: any) {
  return (
    <div className="flex flex-col h-full">

      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Dashboard</h1>
            <p className="text-xs text-muted-foreground">{user?.full_name}</p>
          </div>
        </div>

        {mobile && (
          <Button variant="ghost" size="icon" onClick={onNavigate}>
            <X className="w-6 h-6" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item: any) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
