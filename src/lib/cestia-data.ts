export type ProfileType =
  | "gym_rat"
  | "clean_girl"
  | "meal_prepper"
  | "healthy_flexible"
  | "ultra_procesado";

export const PROFILES: Record<
  ProfileType,
  { name: string; tagline: string; emoji: string; color: string }
> = {
  gym_rat: {
    name: "Gym Rat Disciplinado",
    tagline: "Alta proteína, precio por kilo, sin snacks.",
    emoji: "💪",
    color: "from-primary to-primary-deep",
  },
  clean_girl: {
    name: "Clean Girl / Wellness",
    tagline: "Estética, orgánico, frutas y verduras.",
    emoji: "🌿",
    color: "from-accent to-primary",
  },
  meal_prepper: {
    name: "Meal Prepper",
    tagline: "Funcional, ingredientes en lote.",
    emoji: "🥡",
    color: "from-primary-deep to-primary",
  },
  healthy_flexible: {
    name: "Healthy Flexible",
    tagline: "Equilibrio entre salud y antojos.",
    emoji: "🥗",
    color: "from-primary to-accent",
  },
  ultra_procesado: {
    name: "Ultra Procesado Lover",
    tagline: "Conveniencia, congelados y snacks.",
    emoji: "🍕",
    color: "from-accent to-primary-deep",
  },
};

export type Product = { id: string; name: string; unit: string; price: number; emoji: string };

export const PROFILE_PRODUCTS: Record<ProfileType, Product[]> = {
  gym_rat: [
    { id: "p1", name: "Pechuga de pollo", unit: "kg", price: 18000, emoji: "🍗" },
    { id: "p2", name: "Huevos x30", unit: "bandeja", price: 16500, emoji: "🥚" },
    { id: "p3", name: "Arroz integral", unit: "kg", price: 6500, emoji: "🍚" },
    { id: "p4", name: "Atún en agua", unit: "lata", price: 5800, emoji: "🐟" },
    { id: "p5", name: "Avena en hojuelas", unit: "500g", price: 7200, emoji: "🌾" },
    { id: "p6", name: "Brócoli", unit: "und", price: 4200, emoji: "🥦" },
    { id: "p7", name: "Whey protein", unit: "lb", price: 65000, emoji: "🥤" },
  ],
  clean_girl: [
    { id: "c1", name: "Aguacate hass", unit: "und", price: 4500, emoji: "🥑" },
    { id: "c2", name: "Berries mixtos", unit: "250g", price: 14500, emoji: "🫐" },
    { id: "c3", name: "Kale orgánico", unit: "atado", price: 6800, emoji: "🥬" },
    { id: "c4", name: "Leche de almendras", unit: "lt", price: 12500, emoji: "🥛" },
    { id: "c5", name: "Té matcha", unit: "30g", price: 22000, emoji: "🍵" },
    { id: "c6", name: "Yogur griego", unit: "500g", price: 11500, emoji: "🥣" },
    { id: "c7", name: "Mantequilla de maní natural", unit: "frasco", price: 18000, emoji: "🥜" },
  ],
  meal_prepper: [
    { id: "m1", name: "Arroz blanco", unit: "kg", price: 5200, emoji: "🍚" },
    { id: "m2", name: "Lentejas", unit: "kg", price: 7800, emoji: "🫘" },
    { id: "m3", name: "Pollo desmechado", unit: "kg", price: 17000, emoji: "🍗" },
    { id: "m4", name: "Contenedores x10", unit: "set", price: 24000, emoji: "📦" },
    { id: "m5", name: "Verduras congeladas", unit: "500g", price: 9800, emoji: "🥕" },
    { id: "m6", name: "Aceite de oliva", unit: "500ml", price: 22500, emoji: "🫒" },
    { id: "m7", name: "Quinua", unit: "500g", price: 13500, emoji: "🌾" },
  ],
  healthy_flexible: [
    { id: "h1", name: "Pan integral", unit: "und", price: 7500, emoji: "🍞" },
    { id: "h2", name: "Frutas de temporada", unit: "kg", price: 8500, emoji: "🍎" },
    { id: "h3", name: "Pollo", unit: "kg", price: 15000, emoji: "🍗" },
    { id: "h4", name: "Chocolate 70%", unit: "tableta", price: 9800, emoji: "🍫" },
    { id: "h5", name: "Pasta integral", unit: "500g", price: 6500, emoji: "🍝" },
    { id: "h6", name: "Queso mozzarella", unit: "250g", price: 11500, emoji: "🧀" },
    { id: "h7", name: "Vino tinto", unit: "botella", price: 32000, emoji: "🍷" },
  ],
  ultra_procesado: [
    { id: "u1", name: "Pizza congelada", unit: "und", price: 14500, emoji: "🍕" },
    { id: "u2", name: "Nuggets", unit: "500g", price: 13200, emoji: "🍗" },
    { id: "u3", name: "Papas fritas", unit: "bolsa", price: 8500, emoji: "🍟" },
    { id: "u4", name: "Gaseosa 2L", unit: "und", price: 6800, emoji: "🥤" },
    { id: "u5", name: "Helado", unit: "lt", price: 15500, emoji: "🍦" },
    { id: "u6", name: "Cereal azucarado", unit: "caja", price: 14800, emoji: "🥣" },
    { id: "u7", name: "Salchichas", unit: "500g", price: 12500, emoji: "🌭" },
  ],
};

export const SUGGESTIONS: Record<ProfileType, string> = {
  gym_rat: "más Proteína o Avena",
  clean_girl: "un kale orgánico extra o berries",
  meal_prepper: "más contenedores o quinua para batch cooking",
  healthy_flexible: "frutas de temporada para el postre",
  ultra_procesado: "una pizza extra para el viernes",
};

export type Scenario = "ahorro" | "cercania" | "estrategia";

export const SCENARIOS: Record<
  Scenario,
  { title: string; subtitle: string; description: string; multiplier: number; emoji: string }
> = {
  ahorro: {
    title: "Opción A · Ahorro Total",
    subtitle: "Los precios más bajos",
    description: "Mercados mayoristas y plazas. Vale la pena el desplazamiento.",
    multiplier: 0.85,
    emoji: "💰",
  },
  cercania: {
    title: "Opción B · Cercanía",
    subtitle: "Lo más cómodo",
    description: "Tiendas cerca a tu casa. Más caro pero ahorras tiempo.",
    multiplier: 1.1,
    emoji: "📍",
  },
  estrategia: {
    title: "Opción C · Estrategia de Días",
    subtitle: "Compras fragmentadas",
    description: "Miércoles de pollo, jueves de verdura. Aprovecha promos diarias.",
    multiplier: 0.95,
    emoji: "📅",
  },
};

// Catalog of common grocery items with base reference prices (COP)
export type CatalogItem = { name: string; unit: string; basePrice: number; emoji: string; aliases?: string[] };

export const PRODUCT_CATALOG: CatalogItem[] = [
  { name: "Aguacate Hass", unit: "und", basePrice: 4500, emoji: "🥑", aliases: ["aguacate", "hass", "palta"] },
  { name: "Salchicha", unit: "500g", basePrice: 12500, emoji: "🌭", aliases: ["salchichas", "frankfurt", "viena"] },
  { name: "Arepa", unit: "paquete x5", basePrice: 6800, emoji: "🫓", aliases: ["arepas"] },
  { name: "Leche entera", unit: "litro", basePrice: 5200, emoji: "🥛", aliases: ["leche", "lacteo"] },
  { name: "Huevos AA", unit: "bandeja x30", basePrice: 16500, emoji: "🥚", aliases: ["huevo", "huevos"] },
  { name: "Pan tajado", unit: "und", basePrice: 7800, emoji: "🍞", aliases: ["pan", "pan integral", "pan blanco"] },
  { name: "Arroz blanco", unit: "kg", basePrice: 5200, emoji: "🍚", aliases: ["arroz"] },
  { name: "Pechuga de pollo", unit: "kg", basePrice: 18000, emoji: "🍗", aliases: ["pollo", "pechuga"] },
  { name: "Atún en agua", unit: "lata 170g", basePrice: 5800, emoji: "🐟", aliases: ["atun"] },
  { name: "Yogur griego", unit: "500g", basePrice: 11500, emoji: "🥣", aliases: ["yogurt", "yogur", "griego"] },
  { name: "Aceite vegetal", unit: "litro", basePrice: 14500, emoji: "🫒", aliases: ["aceite", "girasol", "oliva"] },
  { name: "Café molido", unit: "500g", basePrice: 22500, emoji: "☕", aliases: ["cafe", "tinto"] },
  { name: "Manzana roja", unit: "kg", basePrice: 7200, emoji: "🍎", aliases: ["manzana", "manzanas"] },
  { name: "Queso campesino", unit: "500g", basePrice: 13800, emoji: "🧀", aliases: ["queso", "mozzarella", "doble crema"] },
  { name: "Pasta espagueti", unit: "500g", basePrice: 4800, emoji: "🍝", aliases: ["pasta", "espagueti", "tallarines"] },
  { name: "Detergente líquido", unit: "1.8L", basePrice: 24500, emoji: "🧴", aliases: ["detergente", "jabon", "ropa"] },
  { name: "Papel higiénico", unit: "x12", basePrice: 28500, emoji: "🧻", aliases: ["papel", "higienico"] },
  { name: "Banano", unit: "kg", basePrice: 3500, emoji: "🍌", aliases: ["banana", "platano"] },
  { name: "Cebolla cabezona", unit: "kg", basePrice: 4200, emoji: "🧅", aliases: ["cebolla"] },
  { name: "Tomate chonto", unit: "kg", basePrice: 4800, emoji: "🍅", aliases: ["tomate"] },
];

export function findCatalogItem(query: string): CatalogItem | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  // exact / contains by name
  let hit = PRODUCT_CATALOG.find(p => p.name.toLowerCase() === q);
  if (hit) return hit;
  hit = PRODUCT_CATALOG.find(p => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
  if (hit) return hit;
  // alias match
  hit = PRODUCT_CATALOG.find(p => p.aliases?.some(a => a.includes(q) || q.includes(a)));
  return hit ?? null;
}

export const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
