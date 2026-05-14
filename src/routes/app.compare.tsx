import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin } from "lucide-react";
import { formatCOP } from "@/lib/cestia-data";

export const Route = createFileRoute("/app/compare")({ component: Compare });

const STORES = [
  { name: "Plaza Mayorista", distance: "8.5 km", mult: 0.78, badge: "Mejor precio" },
  { name: "D1 cerca a casa", distance: "0.5 km", mult: 0.95, badge: "Más cerca" },
  { name: "Éxito Centro", distance: "2.1 km", mult: 1.05, badge: null },
  { name: "Carulla", distance: "1.8 km", mult: 1.18, badge: null },
];

function Compare() {
  const [q, setQ] = useState("Aguacate hass");
  const [base] = useState(5000);

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
        {STORES.sort((a, b) => a.mult - b.mult).map((s, i) => {
          const price = Math.round(base * s.mult);
          return (
            <Card key={s.name} className="rounded-2xl border-0 bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">{s.name}</p>
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
                <p className={`text-xl font-extrabold ${i === 0 ? "text-primary" : "text-foreground"}`}>{formatCOP(price)}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
