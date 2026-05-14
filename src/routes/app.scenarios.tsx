import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SCENARIOS, type Scenario, formatCOP } from "@/lib/cestia-data";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/scenarios")({ component: Scenarios });

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
      <p className="mt-1 text-sm text-muted-foreground">3 formas de hacer tu mercado con presupuesto de {formatCOP(budget)}.</p>

      <div className="mt-6 space-y-4">
        {(Object.keys(SCENARIOS) as Scenario[]).map((key) => {
          const s = SCENARIOS[key];
          const est = budget * s.multiplier;
          return (
            <Card key={key} className="overflow-hidden rounded-3xl border-0 bg-card shadow-md">
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {s.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-primary-deep">{s.title}</h3>
                  <p className="text-sm font-semibold text-primary">{s.subtitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">Estimado:</p>
                  <p className="text-xl font-extrabold text-foreground">{formatCOP(est)}</p>
                </div>
              </div>
              <Button onClick={() => pick(key)} className="w-full rounded-none bg-primary py-5 font-bold hover:bg-primary-deep">
                Elegir esta opción
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
