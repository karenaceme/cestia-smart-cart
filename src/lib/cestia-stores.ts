import carulla from "@/assets/stores/carulla.png";
import exito from "@/assets/stores/exito.png";
import d1 from "@/assets/stores/d1.webp";
import makro from "@/assets/stores/makro.png";
import ara from "@/assets/stores/ara.png";
import jumbo from "@/assets/stores/jumbo.webp";
import mercamio from "@/assets/stores/mercamio.png";

export type Store = {
  name: string;
  logo: string | null;
  distance: string;
  mult: number;
  badge?: string | null;
};

export const STORES: Store[] = [
  { name: "Merca Mío", logo: mercamio, distance: "6.2 km", mult: 0.76, badge: "Mejor precio" },
  { name: "Makro", logo: makro, distance: "5.8 km", mult: 0.82 },
  { name: "PriceSmart", logo: null, distance: "7.1 km", mult: 0.84 },
  { name: "Tiendas D1", logo: d1, distance: "0.5 km", mult: 0.94, badge: "Más cerca" },
  { name: "Ara", logo: ara, distance: "0.9 km", mult: 0.96 },
  { name: "Éxito", logo: exito, distance: "2.1 km", mult: 1.05 },
  { name: "Jumbo", logo: jumbo, distance: "3.4 km", mult: 1.12 },
  { name: "Carulla", logo: carulla, distance: "1.8 km", mult: 1.2 },
];
