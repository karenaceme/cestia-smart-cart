import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Download, Share2 } from "lucide-react";
import { CestiaLogo } from "@/components/CestiaLogo";
import { formatCOP, PROFILES, SCENARIOS, type ProfileType, type Scenario } from "@/lib/cestia-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/receipt")({ component: Receipt });

type Data = {
  budget: number; people: number; duration: string; scenario: Scenario;
  total: number; items: { id: string; name: string; emoji: string; unit: string; price: number; qty: number }[];
  profile: ProfileType; when: string;
};

function Receipt() {
  const navigate = useNavigate();
  const [d, setD] = useState<Data | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("cestia_export");
    if (!raw) { navigate({ to: "/app" }); return; }
    setD(JSON.parse(raw));
  }, [navigate]);

  if (!d) return null;
  const p = PROFILES[d.profile];
  const sc = SCENARIOS[d.scenario];
  const date = new Date(d.when).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

  const share = async () => {
    const text = `Mi lista Cestia — ${formatCOP(d.total)}\n${d.items.map(i => `• ${i.qty}x ${i.name}`).join("\n")}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Mi lista Cestia", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Lista copiada al portapapeles");
    }
  };

  return (
    <div className="px-5 py-6">
      <Link to="/app" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        <ArrowLeft size={16} /> Inicio
      </Link>

      <Card className="overflow-hidden rounded-3xl border-0 bg-card p-0 shadow-2xl">
        <div className="bg-gradient-to-br from-primary to-primary-deep p-6 text-white">
          <CestiaLogo size={22} light />
          <p className="mt-4 text-xs uppercase tracking-wider text-white/70">Resumen de mercado</p>
          <h1 className="text-3xl font-extrabold">{formatCOP(d.total)}</h1>
          <p className="mt-1 text-xs text-white/80">{date} · {d.people} {d.people === 1 ? "persona" : "personas"} · {d.duration === "week" ? "1 semana" : d.duration === "15days" ? "15 días" : "1 mes"}</p>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary px-3 py-1 font-semibold">{p.emoji} {p.name}</span>
            <span className="rounded-full bg-accent/40 px-3 py-1 font-semibold text-accent-foreground">{sc.emoji} {sc.subtitle}</span>
          </div>

          <div className="border-t border-dashed border-border pt-3">
            {d.items.map(i => (
              <div key={i.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>{i.emoji}</span>
                  <span className="font-semibold">{i.qty}× {i.name}</span>
                </div>
                <span className="font-bold tabular-nums">{formatCOP(i.price * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
            <span className="font-bold text-primary-deep">Total</span>
            <span className="text-xl font-extrabold text-primary-deep">{formatCOP(d.total)}</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-primary/10 p-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-primary-deep">
              <Check size={14} /> Presupuesto: {formatCOP(d.budget)}
            </span>
            <span className={`font-bold ${d.total > d.budget ? "text-destructive" : "text-primary"}`}>
              {d.total > d.budget ? "Excedido" : `Ahorraste ${formatCOP(d.budget - d.total)}`}
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button onClick={share} className="rounded-full bg-primary py-6 font-bold hover:bg-primary-deep">
          <Share2 size={16} className="mr-1" /> Compartir
        </Button>
        <Button onClick={() => window.print()} variant="outline" className="rounded-full border-2 border-primary py-6 font-bold text-primary-deep hover:bg-primary/5">
          <Download size={16} className="mr-1" /> Guardar
        </Button>
      </div>
    </div>
  );
}
