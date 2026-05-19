import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CestiaLogo } from "@/components/CestiaLogo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROFILES, type ProfileType } from "@/lib/cestia-data";
import { ListChecks, Search, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("profile_type").eq("id", user.id).maybeSingle();
      setProfile((data?.profile_type as ProfileType) ?? null);
    })();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Hasta pronto 👋");
    navigate({ to: "/" });
  };

  const p = profile ? PROFILES[profile] : null;

  return (
    <div className="px-5 py-6">
      <header className="flex items-center justify-between">
        <CestiaLogo size={26} />
        <button onClick={logout} className="rounded-full p-2 text-muted-foreground hover:bg-secondary">
          <LogOut size={18} />
        </button>
      </header>

      {p && (
        <Card className="mt-6 overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-primary to-primary-deep p-5 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">{p.emoji}</div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">Tu perfil</p>
              <h3 className="font-bold">{p.name}</h3>
            </div>
          </div>
          <Link to="/app/profile" className="mt-3 inline-block text-xs font-semibold text-accent">
            Cambiar perfil →
          </Link>
        </Card>
      )}

      <section className="mt-8 text-center">
        <h1 className="text-3xl font-extrabold leading-tight text-primary-deep">
          ¿Qué se nos antoja hoy?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Empieza por aquí 👇</p>
      </section>

      <div className="mt-6 grid gap-4">
        <Link to="/app/wizard">
          <Card className="group rounded-3xl border-0 bg-card p-5 shadow-md transition hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow">
                <ListChecks size={26} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Realizar mi lista de compras</h3>
                <p className="text-xs text-muted-foreground">Define presupuesto y arma todo en minutos.</p>
              </div>
              <span className="text-2xl text-primary group-hover:translate-x-1 transition">→</span>
            </div>
          </Card>
        </Link>
        <Link to="/app/compare">
          <Card className="group rounded-3xl border-0 bg-card p-5 shadow-md transition hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow">
                <Search size={26} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">Comparar un producto específico</h3>
                <p className="text-xs text-muted-foreground">Encuentra el mejor precio al instante.</p>
              </div>
              <span className="text-2xl text-primary group-hover:translate-x-1 transition">→</span>
            </div>
          </Card>
        </Link>
      </div>

      <Card className="mt-8 rounded-3xl border-0 bg-accent/40 p-5">
        <p className="text-sm font-semibold text-accent-foreground">💡 Tip Cestia</p>
        <p className="mt-1 text-sm text-foreground">
          Compra los miércoles para mejores precios en frutas y verduras.
        </p>
      </Card>
    </div>
  );
}
