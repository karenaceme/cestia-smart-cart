import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CestiaLogo } from "@/components/CestiaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShoppingBasket, Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cestia · Calculadora inteligente de mercado" },
      { name: "description", content: "Compara precios, arma tu lista y cuida tu presupuesto con Cestia." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/app" },
        });
        if (error) throw error;
        toast.success("¡Cuenta creada! Bienvenido a Cestia 🎉");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Hola de nuevo!");
      }
      navigate({ to: "/app" });
    } catch (err: any) {
      toast.error(err.message ?? "Algo falló");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary-deep">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <header className="mb-10">
          <CestiaLogo size={36} light />
        </header>

        <section className="mb-10 text-white">
          <h1 className="text-4xl font-extrabold leading-tight">
            Compara. Ahorra. <span className="text-accent">Disfruta.</span>
          </h1>
          <p className="mt-3 text-white/85">
            Tu calculadora inteligente de mercado. Arma listas según tu estilo de vida y cuida cada peso.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { i: ShoppingBasket, t: "Listas inteligentes" },
              { i: TrendingDown, t: "Mejores precios" },
              { i: Sparkles, t: "Personalizado" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <Icon className="mx-auto mb-1" size={20} />
                {t}
              </div>
            ))}
          </div>
        </section>

        <Card className="rounded-3xl border-0 bg-card p-6 shadow-2xl">
          <div className="mb-4 flex rounded-full bg-secondary p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                  mode === m ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-6 text-base font-bold text-primary-foreground hover:bg-primary-deep">
              {loading ? "Un momento..." : mode === "login" ? "Entrar" : "Crear mi cuenta"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-white/70">
          Clara. Confiable. Directa. Hecha para ti.
        </p>
      </div>
    </div>
  );
}
