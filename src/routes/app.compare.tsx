import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin } from "lucide-react";
import { formatCOP } from "@/lib/cestia-data";
import { STORES } from "@/lib/cestia-stores";

export const Route = createFileRoute("/app/compare")({ component: Compare });

function Compare() {
  const [q, setQ] = useState("Aguacate hass");
  const [base] = useState(5000);

  const sorted = [...STORES].sort((a, b) => a.mult - b.mult);

  return (
    <div className="px-5 py-6">
      <Link to="/app" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        <ArrowLeft size={16} /> Atrás
      </Link>
      <h1 className="text-2xl font-extrabold text-primary-deep">Comparar producto</h1>
      <p className="mt-1 text-sm text-muted-foreground">Mira cuánto cuesta en cada lugar.</p>

      <div className="mt-5 flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-md">
        <Search size={18} className="text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto..." className="border-0 bg-transparent focus-visible:ring-0" />
      </div>

      <div className="mt-5 space-y-3">
        {sorted.map((s, i) => {
          const price = Math.round(base * s.mult);
          return (
            <Card key={s.name} className="rounded-2xl border-0 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border">
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} className="max-h-12 max-w-12 object-contain" />
                  ) : (
                    <span className="text-xs font-extrabold text-primary-deep">{s.name.split(" ")[0]}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-bold text-foreground">{s.name}</p>
                    {s.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        i === 0 ? "bg-primary text-white" : "bg-accent text-accent-foreground"
                      }`}>{s.badge}</span>
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} /> {s.distance}
                  </p>
                </div>
                <p className={`text-lg font-extrabold ${i === 0 ? "text-primary" : "text-foreground"}`}>{formatCOP(price)}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
