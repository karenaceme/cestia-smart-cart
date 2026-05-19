import logoSrc from "@/assets/cestia-logo.jpeg";

export function CestiaLogo({ size = 32, light = false }: { size?: number; light?: boolean }) {
  // Logo image has black background; on light surfaces use a dark rounded chip
  // to maintain contrast with the brand mark.
  const height = size + 16;
  const wrapper = light
    ? ""
    : "rounded-2xl bg-[#0a0a0a] px-3 py-1.5 shadow-sm";
  return (
    <div className={`inline-flex items-center ${wrapper}`}>
      <img
        src={logoSrc}
        alt="Cestia"
        style={{ height, width: "auto" }}
        className="block object-contain"
      />
    </div>
  );
}
