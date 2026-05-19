import logoSrc from "@/assets/cestia-logo.png";

export function CestiaLogo({ size = 32 }: { size?: number; light?: boolean }) {
  const height = size + 16;
  return (
    <img
      src={logoSrc}
      alt="Cestia"
      style={{ height, width: "auto" }}
      className="block object-contain select-none"
    />
  );
}
