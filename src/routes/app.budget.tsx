import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { formatCOP, PROFILES, SCENARIOS, type ProfileType, type Scenario } from "@/lib/cestia-data";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/app/budget")({ component: Budget });

type Row = { id: string; budget: number; total: number; people: number; duration: string; scenario: Scenario; created_at: string };

function Budget() {
  const [rows, setRows] = useState<Row[]>([]);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: lists }, { data: prof }] = await Promise.all([
        supabase.from("shopping_lists").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("profile_type").eq("id", user.id).maybeSingle(),
      ]);
      setRows((lists ?? []) as any);
      setProfile((prof?.profile_type as ProfileType) ?? null);
    })();
  }, []);

  const totalSpent = rows.reduce((s, r) => s + Number(r.total), 0);
  const totalBudget = rows.reduce((s, r) => s + Number(r.budget), 0);
  const saved = totalBudget - totalSpent;

  return (
    <div className="px-5 py-6">
      <h1 className="text-2xl font-extrabold text-primary-deep">Mi presupuesto</h1>
      {profile && <p className="text-sm text-muted-foreground">Perfil · {PROFILES[profile].name}</p>}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-primary to-primary-deep p-4 text-white">
          <Wallet size={20} />
          <p className="mt-2 text-xs text-white/80">Total gastado</p>
          <p className="text-xl font-extrabold">{formatCOP(totalSpent)}</p>
        </Card>
        <Card className={`rounded-2xl border-0 p-4 ${saved >= 0 ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}`}>
          {saved >= 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
          <p className="mt-2 text-xs opacity-80">{saved >= 0 ? "Total ahorrado" : "Excedido"}</p>
          <p className="text-xl font-extrabold">{formatCOP(Math.abs(saved))}</p>
        </Card>
      </div>

      <h2 className="mt-8 mb-3 font-bold text-primary-deep">Listas recientes</h2>
      <div className="space-y-3">
        {rows.length === 0 && (
          <Card className="rounded-2xl border-0 bg-card p-6 text-center text-sm text-muted-foreground">
            Aún no tienes listas guardadas.
          </Card>
        )}
        {rows.slice(0, 5).map(r => {
          const over = Number(r.total) > Number(r.budget);
          return (
            <Card key={r.id} className="rounded-2xl border-0 bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</p>
                  <p className="font-bold">{SCENARIOS[r.scenario].subtitle}</p>
                  <p className="text-xs text-muted-foreground">{r.people} pers · presupuesto {formatCOP(Number(r.budget))}</p>
                </div>
                <p className={`text-lg font-extrabold ${over ? "text-destructive" : "text-primary"}`}>{formatCOP(Number(r.total))}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
