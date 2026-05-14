import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { formatCOP, SCENARIOS, type Scenario } from "@/lib/cestia-data";
import { Receipt } from "lucide-react";

export const Route = createFileRoute("/app/history")({ component: History });

type Row = {
  id: string; budget: number; total: number; people: number; duration: string;
  scenario: Scenario; created_at: string;
  items: { id: string; name: string; qty: number; emoji: string }[];
};

function History() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("shopping_lists").select("*").order("created_at", { ascending: false });
      setRows((data ?? []) as any);
    })();
  }, []);

  return (
    <div className="px-5 py-6">
      <h1 className="text-2xl font-extrabold text-primary-deep">Historial</h1>
      <p className="text-sm text-muted-foreground">Todas tus listas guardadas.</p>

      <div className="mt-5 space-y-3">
        {rows.length === 0 && (
          <Card className="rounded-2xl border-0 bg-card p-8 text-center">
            <Receipt className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Aún no tienes listas. Crea tu primera 🌱</p>
          </Card>
        )}
        {rows.map(r => {
          const over = Number(r.total) > Number(r.budget);
          return (
            <Card key={r.id} className="rounded-2xl border-0 bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-primary">{SCENARIOS[r.scenario].title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("es-CO")}</p>
                </div>
                <p className={`text-lg font-extrabold ${over ? "text-destructive" : "text-primary"}`}>{formatCOP(Number(r.total))}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(r.items ?? []).slice(0, 8).map(i => (
                  <span key={i.id} className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold">
                    {i.emoji} {i.qty}× {i.name}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
