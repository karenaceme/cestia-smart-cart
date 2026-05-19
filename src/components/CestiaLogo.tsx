import { ShoppingCart, Check } from "lucide-react";

export function CestiaLogo({ size = 32, light = false }: { size?: number; light?: boolean }) {
  const fg = light ? "text-white" : "text-primary-deep";
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-2xl bg-primary"
        style={{ width: size + 12, height: size + 12 }}
      >
        <ShoppingCart className="text-white" size={size - 4} strokeWidth={2.5} />
      </div>
      <div className={`flex items-baseline font-extrabold ${fg}`} style={{ fontSize: size }}>
        <span>estia</span>
        <Check className="text-primary -ml-1" size={size * 0.45} strokeWidth={4} />
      </div>
    </div>
  );
}
