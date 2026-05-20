import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SCENARIOS, type Scenario, formatCOP } from "@/lib/cestia-data";
import { STORES } from "@/lib/cestia-stores";
import { ArrowLeft, Clock, MapPin, Tag, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/scenarios")({ component: Scenarios });

// Realistic store suggestions per scenario
const findStore = (name: string) => STORES.find((s) => s.name === name);

const SCENARIO_DETAILS: Record<
  Scenario,
  {
    stores: { name: string; note: string }[];
    highlights: { icon: "save" | "time" | "tag"; text: string }[];
  }
> = {
  ahorro: {
    stores: [
      { name: "Tiendas D1", note: "Marca propia, precios bajos" },
      { name: "Ara", note: "Promos semanales fuertes" },
      { name: "Makro", note: "Mayorista, ideal para mes" },
    ],
    highlights: [
      { icon: "save", text: "Ahorras hasta un 15% vs. supermercado" },
      { icon: "time", text: "Trayecto estimado: 20–25 min" },
      { icon: "tag", text: "Mejor para compras grandes del mes" },
    ],
  },
  cercania: {
    stores: [
      { name: "Carulla", note: "A menos de 5 min · surtido completo" },
      { name: "Éxito", note: "Express, todo en un solo viaje" },
    ],
    highlights: [
      { icon: "time", text: "Llegas en menos de 5 minutos" },
      { icon: "tag", text: "Comodidad primero, ideal entre semana" },
      { icon: "save", text: "Pagas un poco más, ahorras tiempo" },
    ],
  },
  estrategia: {
    stores: [
      { name: "Merca Mío", note: "🐔 ¡Hoy Miércoles de Pollo · 20% dto!" },
      { name: "Éxito", note: "🥦 Mañana Jueves de Frutas y Verduras" },
      { name: "Carulla", note: "🥜 Hoy descuentos en Frutos Secos" },
    ],
    highlights: [
      { icon: "tag", text: "Aprovecha promos programadas por día" },
      { icon: "save", text: "Hasta 20% en categorías rotativas" },
      { icon: "time", text: "Divide tu compra en 2–3 visitas cortas" },
    ],
  },
};

const ICONS = { save: TrendingDown, time: Clock, tag: Tag } as const;

function Scenarios() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("cestia_wizard");
    if (!raw) { navigate({ to: "/app/wizard" }); return; }
    setBudget(JSON.parse(raw).budget);
  }, [navigate]);

  const pick = (s: Scenario) => {
    sessionStorage.setItem("cestia_scenario", s);
    navigate({ to: "/app/calculator" });
  };

  return (
    <div className="px-5 py-6">
      <Link to="/app/wizard" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        <ArrowLeft size={16} /> Atrás
      </Link>
      <h1 className="text-2xl font-extrabold text-primary-deep">Elige tu estrategia</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        3 formas de hacer tu mercado con presupuesto de {formatCOP(budget)}.
      </p>

      <div className="mt-6 space-y-5">
        {(Object.keys(SCENARIOS) as Scenario[]).map((key) => {
          const s = SCENARIOS[key];
          const d = SCENARIO_DETAILS[key];
          const est = budget * s.multiplier;
          return (
            <Card key={key} className="overflow-hidden rounded-3xl border-0 bg-card shadow-md">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                    {s.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-primary-deep">{s.title}</h3>
                    <p className="text-sm font-semibold text-primary">{s.subtitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>

                {/* Stores */}
                <div className="mt-4 space-y-2">
                  {d.stores.map((st) => {
                    const store = findStore(st.name);
                    return (
                      <div
                        key={st.name}
                        className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-2.5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border">
                          {store?.logo ? (
                            <img src={store.logo} alt={st.name} className="h-full w-full object-contain p-1" />
                          ) : (
                            <span className="text-[10px] font-bold text-primary-deep">{st.name.slice(0, 2)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">{st.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{st.note}</p>
                        </div>
                        {store?.distance && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-primary-deep ring-1 ring-border">
                            <MapPin size={10} /> {store.distance}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Highlights */}
                <ul className="mt-4 space-y-1.5">
                  {d.highlights.map((h, idx) => {
                    const Icon = ICONS[h.icon];
                    return (
                      <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                        <Icon size={14} className="text-primary" />
                        <span>{h.text}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Estimado total:</span>
                  <span className="text-xl font-extrabold text-foreground">{formatCOP(est)}</span>
                </div>
              </div>

              <Button
                onClick={() => pick(key)}
                className="w-full rounded-none bg-primary py-5 font-bold hover:bg-primary-deep"
              >
                Elegir esta opción
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
