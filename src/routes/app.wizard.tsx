import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/app/wizard")({ component: Wizard });

function Wizard() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState("300000");
  const [people, setPeople] = useState(2);
  const [duration, setDuration] = useState("week");

  const next = () => {
    sessionStorage.setItem("cestia_wizard", JSON.stringify({ budget: Number(budget), people, duration }));
    navigate({ to: "/app/scenarios" });
  };

  return (
    <div className="px-5 py-6">
      <Link to="/app" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deep">
        <ArrowLeft size={16} /> Atrás
      </Link>
      <h1 className="text-2xl font-extrabold text-primary-deep">Cuéntanos sobre tu mercado</h1>
      <p className="mt-1 text-sm text-muted-foreground">Esto nos ayuda a calcular bien tu lista.</p>

      <Card className="mt-6 space-y-6 rounded-3xl border-0 bg-card p-6 shadow-md">
        <div>
          <Label htmlFor="b" className="font-semibold">Presupuesto máximo</Label>
          <div className="mt-2 flex items-center rounded-full bg-secondary px-4">
            <span className="font-bold text-primary-deep">$</span>
            <Input id="b" type="number" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)}
              className="border-0 bg-transparent text-lg font-bold focus-visible:ring-0" />
            <span className="text-sm text-muted-foreground">COP</span>
          </div>
        </div>

        <div>
          <Label className="font-semibold">Número de personas</Label>
          <div className="mt-2 flex items-center justify-between rounded-full bg-secondary px-4 py-2">
            <button onClick={() => setPeople(Math.max(1, people - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow">
              <Minus size={18} />
            </button>
            <span className="text-2xl font-extrabold text-primary-deep">{people}</span>
            <button onClick={() => setPeople(people + 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <Label className="font-semibold">Duración del mercado</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="mt-2 rounded-full bg-secondary border-0 px-4 py-6">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">1 semana</SelectItem>
              <SelectItem value="15days">15 días</SelectItem>
              <SelectItem value="month">1 mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Button onClick={next} className="mt-6 w-full rounded-full bg-primary py-6 text-base font-bold hover:bg-primary-deep">
        Ver opciones de compra →
      </Button>
    </div>
  );
}
