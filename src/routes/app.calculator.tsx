import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, AlertTriangle, Sparkles, Download, Plus as PlusIcon } from "lucide-react";
import { PROFILE_PRODUCTS, PROFILES, SCENARIOS, SUGGESTIONS, formatCOP, type ProfileType, type Scenario, type Product } from "@/lib/cestia-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/app/calculator")({ component: Calculator });

type Item = Product & { qty: number };

function Calculator() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(0);
  const [people, setPeople] = useState(1);
  const [duration, setDuration] = useState("week");
  const [scenario, setScenario] = useState<Scenario>("ahorro");
  const [profile, setProfile] = useState<ProfileType>("healthy_flexible");
  const [items, setItems] = useState<Item[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const w = sessionStorage.getItem("cestia_wizard");
    const sc = sessionStorage.getItem("cestia_scenario") as Scenario | null;
    if (!w || !sc) { navigate({ to: "/app/wizard" }); return; }
    const wp = JSON.parse(w);
    setBudget(wp.budget); setPeople(wp.people); setDuration(wp.duration); setScenario(sc);

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("profile_type").eq("id", user.id).maybeSingle();
      const p = (data?.profile_type as ProfileType) ?? "healthy_flexible";
      setProfile(p);
      const mult = SCENARIOS[sc].multiplier;
      setItems(PROFILE_PRODUCTS[p].map(pr => ({ ...pr, price: Math.round(pr.price * mult), qty: 1 })));
    })();
  }, [navigate]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const over = total > budget;
  const pct = Math.min(100, (total / Math.max(1, budget)) * 100);

  const change = (id: string, delta: number) =>
    setItems(items.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i));

  const exportList = async () => {
    setExporting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("shopping_lists").insert({
        user_id: user.id, budget, people, duration, scenario,
        total, items: items.filter(i => i.qty > 0) as any,
      });
    }
    setExporting(false);
    sessionStorage.setItem("cestia_export", JSON.stringify({
      budget, people, duration, scenario, total,
      items: items.filter(i => i.qty > 0), profile, when: new Date().toISOString(),
    }));
    navigate({ to: "/app/receipt" });
  };

  const p = PROFILES[profile];

  return (
    <div className="px-5 py-6 pb-40">
      <Link to="/app/scenarios" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        <ArrowLeft size={16} /> Atrás
      </Link>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-extrabold text-primary-deep">Tu lista</h1>
        <span className="text-xs font-semibold text-muted-foreground">{p.emoji} {p.name}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{SCENARIOS[scenario].title}</p>

      <div className="mt-5 space-y-3">
        {items.map(i => (
          <Card key={i.id} className="rounded-2xl border-0 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">{i.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-foreground">{i.name}</p>
                <p className="text-xs text-muted-foreground">{formatCOP(i.price)} / {i.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => change(i.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary-deep">
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-bold">{i.qty}</span>
                <button onClick={() => change(i.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Link to="/app/compare">
        <Button variant="outline" className="mt-4 w-full rounded-full border-2 border-dashed border-primary/40 bg-transparent py-5 font-semibold text-primary-deep hover:bg-primary/5">
          <PlusIcon size={16} className="mr-2" /> ¿Deseas agregar algo más?
        </Button>
      </Link>

      {/* Floating total bar */}
      <div className="fixed bottom-20 left-0 right-0 z-30 px-4">
        <div className="mx-auto max-w-md">
          {over ? (
            <div className="mb-2 flex items-center gap-2 rounded-2xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground shadow-lg">
              <AlertTriangle size={18} />
              ¡Cuidado! Te has excedido de tu presupuesto.
            </div>
          ) : total > 0 && total < budget * 0.95 ? (
            <div className="mb-2 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-lg">
              <Sparkles size={18} />
              Aún tienes saldo, podrías agregar {SUGGESTIONS[profile]}.
            </div>
          ) : null}

          <div className="rounded-3xl bg-card p-4 shadow-2xl ring-1 ring-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total · presupuesto {formatCOP(budget)}</span>
              <span className={over ? "font-bold text-destructive" : "font-bold text-primary"}>{Math.round(pct)}%</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className={`text-2xl font-extrabold ${over ? "text-destructive" : "text-primary-deep"}`}>{formatCOP(total)}</p>
              <Button onClick={exportList} disabled={exporting} className="rounded-full bg-primary px-5 font-bold hover:bg-primary-deep">
                <Download size={16} className="mr-1" /> Exportar
              </Button>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className={`h-full transition-all ${over ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
