// Páginas de Aplicaciones (Náutica, Toldos y Pérgolas, Mobiliario Exterior).
// Las imágenes viven en public/aplicaciones/<slug>/ (hero.jpg, uso.jpg). Mientras
// no estén, se usa un gradiente de respaldo (background-image cae al gradiente).

export type SeoBloque =
  | { tipo: "label"; texto: string }
  | { tipo: "h2"; texto: string }
  | { tipo: "p"; texto: string };

export type AplicacionPage = {
  slug: string; // URL: /aplicaciones/<slug>
  aplicacionSlug: string; // slug en la tabla `aplicaciones` (para traer productos)
  nombre: string;
  tituloLineas?: string[]; // saltos de línea forzados del título del hero
  intro: string; // eyebrow del hero
  acercaDe: { label: string; texto: string };
  gradient: string; // respaldo de las fotos
  accent: string; // color de la aplicación (apagado, combina con el crema)
  heroBg: string; // fondo oscuro del hero (versión profunda del accent)
  seo: { bloques: SeoBloque[] };
};

export const APLICACIONES: AplicacionPage[] = [
  {
    slug: "nautica",
    aplicacionSlug: "nautica",
    nombre: "Náutica",
    intro: "Aplicaciones · Náutica",
    acercaDe: {
      label: "Acerca de",
      texto:
        "Lonas pensadas para el agua: resisten sal, sol y humedad sin perder color ni forma. Para toldos de embarcación, capotas, fundas y tapizados náuticos.",
    },
    gradient: "linear-gradient(160deg, #1f3d45 0%, #356174 100%)",
    accent: "#3a5a72",
    heroBg: "#1d2f3e",
    seo: {
      bloques: [
        {
          tipo: "label",
          texto: "Soluciones técnicas para cada embarcación",
        },
        {
          tipo: "p",
          texto:
            "El ambiente marino es de los más exigentes para cualquier textil: sal, radiación UV constante y humedad permanente. Las lonas Sauleda para uso náutico están teñidas en masa y tratadas para soportar esas condiciones, manteniendo el color y la resistencia temporada tras temporada.",
        },
        {
          tipo: "h2",
          texto: "Durabilidad donde más importa",
        },
        {
          tipo: "p",
          texto:
            "Desde capotas y biminis hasta fundas y tapicería exterior de cubierta, cada aplicación tiene su tela. Trabajamos acrílicos de alta tenacidad y cristales de PVC para cerramientos, con un mantenimiento mínimo y una vida útil que justifica la inversión.",
        },
        {
          tipo: "label",
          texto: "Asesoramiento para toldistas y astilleros",
        },
        {
          tipo: "p",
          texto:
            "Si trabajás el rubro náutico, te ayudamos a elegir la línea correcta según uso, exposición y terminación. Comprá por metro o por rollo, con color y código de fábrica.",
        },
      ],
    },
  },
  {
    slug: "toldos-y-pergolas",
    aplicacionSlug: "toldos",
    nombre: "Toldos y Pérgolas",
    tituloLineas: ["Toldos y", "Pérgolas"],
    intro: "Aplicaciones · Toldos y Pérgolas",
    acercaDe: {
      label: "Acerca de",
      texto:
        "Sombra que dura. Acrílicos teñidos en masa y microperforados que filtran el sol, para toldos extensibles, pérgolas y protección solar de exteriores.",
    },
    gradient: "linear-gradient(160deg, #8a5f3e 0%, #a97c54 100%)",
    accent: "#8a6d2f",
    heroBg: "#39301a",
    seo: {
      bloques: [
        {
          tipo: "label",
          texto: "Aplicaciones variadas para cada proyecto",
        },
        {
          tipo: "p",
          texto:
            "El toldo define un espacio: lo protege del sol, lo hace usable y lo embellece. Las lonas acrílicas Sauleda, teñidas en masa, mantienen el color a la intemperie y resisten la decoloración, los hongos y el agua gracias a sus tratamientos hidrófugos y antihongos.",
        },
        {
          tipo: "h2",
          texto: "De la casa al local comercial",
        },
        {
          tipo: "p",
          texto:
            "Toldos extensibles de brazos invisibles, pérgolas bioclimáticas, cortinas de cristal para cerrar galerías. Cada solución pide una tela distinta, con su ancho (1,20 o 1,50 m), su gramaje y su nivel de apertura. Te ayudamos a elegir la justa.",
        },
        {
          tipo: "label",
          texto: "Color y medida a tu gusto",
        },
        {
          tipo: "p",
          texto:
            "Decenas de colores por línea, elegibles desde el catálogo, y venta por metro lineal o por rollo. Sumá los insumos —brazos, tubos, motores— para resolver el toldo completo en un solo lugar.",
        },
      ],
    },
  },
  {
    slug: "mobiliario-exterior",
    aplicacionSlug: "tapiceria-exterior",
    nombre: "Mobiliario Exterior",
    intro: "Aplicaciones · Mobiliario Exterior",
    acercaDe: {
      label: "Acerca de",
      texto:
        "Tapicería que vive afuera. Telas para almohadones, sillería y muebles de jardín que aguantan sol y lluvia sin desteñir ni endurecerse.",
    },
    gradient: "linear-gradient(160deg, #4f4a3a 0%, #7e8a6b 100%)",
    accent: "#5e6e45",
    heroBg: "#343c27",
    seo: {
      bloques: [
        {
          tipo: "label",
          texto: "Confort que resiste la intemperie",
        },
        {
          tipo: "p",
          texto:
            "El mobiliario de exterior exige textiles que combinen estética y resistencia: que sean agradables al tacto pero soporten la exposición continua. Los acrílicos Sauleda ofrecen una mano suave, una paleta amplia y una resistencia al UV que mantiene los tapizados vivos por años.",
        },
        {
          tipo: "h2",
          texto: "Para tapiceros y diseñadores",
        },
        {
          tipo: "p",
          texto:
            "Almohadones de pérgola, sillería de jardín, puffs y cabeceras de exterior. Telas que se limpian fácil, secan rápido y no crían hongos, ideales para proyectos de hotelería, gastronomía y residencias.",
        },
        {
          tipo: "label",
          texto: "Coordiná toldo y tapizado",
        },
        {
          tipo: "p",
          texto:
            "Al trabajar la misma marca podés coordinar el toldo y el mobiliario con colores de la misma carta. Consultanos por combinaciones y disponibilidad.",
        },
      ],
    },
  },
];

export function getAplicacionPage(slug: string): AplicacionPage | undefined {
  return APLICACIONES.find((a) => a.slug === slug);
}
