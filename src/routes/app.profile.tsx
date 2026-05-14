import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CestiaLogo } from "@/components/CestiaLogo";
import { PROFILES, type ProfileType } from "@/lib/cestia-data";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

export const Route = createFileRoute("/app/profile")({ component: ProfilePick });

function ProfilePick() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<ProfileType | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!picked) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({ id: user.id, profile_type: picked, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("¡Perfil guardado! 🎯");
    navigate({ to: "/app" });
  };

  return (
    <div className="px-5 py-6">
      <div className="mb-6"><CestiaLogo size={28} /></div>
      <h1 className="text-2xl font-extrabold text-primary-deep">Cuéntanos cómo compras</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Elige el perfil que más se parece a ti. Personalizamos tus listas y alertas.
      </p>

      <div className="mt-6 space-y-3">
        {(Object.keys(PROFILES) as ProfileType[]).map((key) => {
          const p = PROFILES[key];
          const active = picked === key;
          return (
            <Card
              key={key}
              onClick={() => setPicked(key)}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                active ? "border-primary bg-primary/5 shadow-lg" : "border-transparent bg-card"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-2xl shadow`}>
                  {p.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                </div>
                {active && <Check className="text-primary" />}
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        disabled={!picked || saving}
        onClick={save}
        className="mt-6 w-full rounded-full bg-primary py-6 text-base font-bold hover:bg-primary-deep"
      >
        {saving ? "Guardando..." : "Continuar"}
      </Button>
    </div>
  );
}
