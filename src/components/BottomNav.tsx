import { Link, useLocation } from "@tanstack/react-router";
import { Home, Wallet, History } from "lucide-react";

export function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: "/app", label: "Home", icon: Home },
    { to: "/app/budget", label: "Budget", icon: Wallet },
    { to: "/app/history", label: "Historial", icon: History },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-semibold transition ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
