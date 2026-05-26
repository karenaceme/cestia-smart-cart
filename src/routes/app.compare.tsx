import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Search, MapPin, Plus } from "lucide-react";
import { formatCOP, findCatalogItem, PRODUCT_CATALOG, type Scenario, type CatalogItem } from "@/lib/cestia-data";
import { STORES, type Store } from "@/lib/cestia-stores";
import { toast } from "sonner";

export const Route = createFileRoute("/app/compare")({ component: Compare });

const SCENARIO_STORES: Record<Scenario, string[]> = {
  ahorro: ["Tiendas D1", "Ara", "Makro", "Merca Mío", "PriceSmart"],
  cercania: ["Carulla", "Éxito"],
  estrategia: ["Merca Mío", "Éxito", "Carulla"],
};

const SCENARIO_LABEL: Record<Scenario, string> = {
  ahorro: "Ahorro Total",
  cercania: "Cercanía",
  estrategia: "Estrategia de Días",
};

function Compare() {
  const navigate = useNavigate();
  const [q, setQ] = useState("Aguacate Hass");
  const [scenario, setScenario] = useState<Scenario>("ahorro");
  const [pending, setPending] = useState<{ store: Store; price: number; cheapest: Store; cheapestPrice: number } | null>(null);

  useEffect(() => {
    const sc = (localStorage.getItem("cestia_scenario") || sessionStorage.getItem("cestia_scenario")) as Scenario | null;
    if (sc) setScenario(sc);
  }, []);

  const matched: CatalogItem | null = useMemo(() => findCatalogItem(q), [q]);
  const base = matched?.basePrice ?? 0;
  const suggestions = useMemo(
    () => PRODUCT_CATALOG.filter(p => p.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6),
    [q],
  );

  const sorted = useMemo(() => [...STORES].sort((a, b) => a.mult - b.mult), []);
  const cheapest = sorted[0];
  const cheapestPrice = Math.round(base * cheapest.mult);
  const allowed = SCENARIO_STORES[scenario];

  const addToList = (store: Store, price: number) => {
    if (!matched) return;
    const raw = localStorage.getItem("cestia_extras");
    const extras = raw ? JSON.parse(raw) : [];
    extras.push({
      id: `extra_${Date.now()}`,
      name: matched.name,
      unit: matched.unit,
      price,
      emoji: matched.emoji,
      store: store.name,
      qty: 1,
    });
    localStorage.setItem("cestia_extras", JSON.stringify(extras));
    toast.success(`${matched.name} agregado desde ${store.name}`);
    navigate({ to: "/app/calculator" });
  };

  const handleAdd = (store: Store, price: number) => {
    if (!allowed.includes(store.name)) {
      setPending({ store, price, cheapest, cheapestPrice });
      return;
    }
    // If user is adding from an allowed store but cheapest (cheaper) is in a non-allowed store → warn too
    if (store.name !== cheapest.name && !allowed.includes(cheapest.name) && cheapestPrice < price) {
      setPending({ store, price, cheapest, cheapestPrice });
      return;
    }
    addToList(store, price);
  };

  return (
    <div className="px-5 py-6">
      <Link to="/app/calculator" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        <ArrowLeft size={16} /> Atrás
      </Link>
      <h1 className="text-2xl font-extrabold text-primary-deep">Comparar producto</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estrategia activa: <span className="font-semibold text-primary-deep">{SCENARIO_LABEL[scenario]}</span>
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-md">
        <Search size={18} className="text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto..." className="border-0 bg-transparent focus-visible:ring-0" />
      </div>

      <div className="mt-5 space-y-3">
        {sorted.map((s, i) => {
          const price = Math.round(base * s.mult);
          const isAllowed = allowed.includes(s.name);
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
                    {i === 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">Mejor precio</span>
                    )}
                    {isAllowed && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">Tu estrategia</span>
                    )}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} /> {s.distance}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className={`text-lg font-extrabold ${i === 0 ? "text-primary" : "text-foreground"}`}>{formatCOP(price)}</p>
                  <Button size="sm" onClick={() => handleAdd(s, price)} className="h-7 rounded-full bg-primary px-3 text-xs font-bold hover:bg-primary-deep">
                    <Plus size={12} className="mr-1" /> Agregar
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary-deep">¿Seguro de agregarlo aquí?</AlertDialogTitle>
            <AlertDialogDescription>
              En <span className="font-bold text-primary-deep">{pending?.cheapest.name}</span> está más barato
              ({pending && formatCOP(pending.cheapestPrice)}), pero recuerda que elegiste la opción de
              <span className="font-bold"> {SCENARIO_LABEL[scenario]}</span>
              {scenario === "cercania" ? " (comprar todo en un solo lugar cerca de ti)" : ""}.
              ¿Quieres agregarlo de todas formas desde <span className="font-bold">{pending?.store.name}</span> ({pending && formatCOP(pending.price)})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) addToList(pending.store, pending.price);
                setPending(null);
              }}
              className="rounded-full bg-primary hover:bg-primary-deep"
            >
              Sí, agregar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
