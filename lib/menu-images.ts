// Imágenes del mega-menú "Productos" — viven en el código + assets, NO en la base.
//
// Cómo usar:
//   1. Poné las fotos en  public/menu/  (ej. public/menu/lona-acrilica-120.jpg)
//   2. Mapealas acá por el SLUG del producto. (El ítem "Insumos para toldos" usa
//      la clave especial "insumos".)
//   3. Lo que no esté mapeado, aparece como espacio vacío en el desplegable.
//
// Las rutas son relativas a /public, así que empiezan con "/".

export const MENU_IMAGES: Record<string, string> = {
  // "lona-acrilica-120": "/menu/lona-acrilica-120.jpg",
  // "lona-acrilica-150": "/menu/lona-acrilica-150.jpg",
  // "soltis-92": "/menu/soltis-92.jpg",
  // "cristal-pvc-achilles": "/menu/cristal-pvc.jpg",
  // "insumos": "/menu/insumos.jpg",
};
