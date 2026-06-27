"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { guardarProducto } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import type {
  OpcionRubro,
  OpcionCategoria,
  OpcionAplicacion,
  ProductoEdit,
} from "@/lib/admin";

type Opciones = {
  rubros: OpcionRubro[];
  categorias: OpcionCategoria[];
  aplicaciones: OpcionAplicacion[];
};

type VarianteRow = {
  _key: string;
  id?: string;
  tipo: "color" | "medida" | "modelo";
  nombre: string;
  codigo: string;
  swatch_hex: string;
  swatch_url: string;
  sku: string;
  precio_override: string;
  stock: string;
  activo: boolean;
};

const input =
  "h-11 w-full rounded-sm border border-line bg-paper px-3 text-sm text-bark outline-none transition-colors focus:border-camel";
const cellInput =
  "h-9 w-full rounded-sm border border-line bg-paper px-2 text-xs text-bark outline-none focus:border-camel";
const label = "font-mono text-xs uppercase tracking-[0.16em] text-cocoa";

function uid() {
  return Math.random().toString(36).slice(2);
}

export function ProductForm({
  opciones,
  producto,
  destacadosCount,
}: {
  opciones: Opciones;
  producto?: ProductoEdit;
  destacadosCount: number;
}) {
  const router = useRouter();
  const toast = useToast();

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [codigo, setCodigo] = useState(producto?.codigo ?? "");
  const [rubroId, setRubroId] = useState(producto?.rubro_id ?? "");
  const [categoriaId, setCategoriaId] = useState(producto?.categoria_id ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [fichaTecnica, setFichaTecnica] = useState(
    producto?.ficha_tecnica ?? "",
  );
  const [precioBase, setPrecioBase] = useState(
    producto?.precio_base != null ? String(producto.precio_base) : "",
  );
  const [unidad, setUnidad] = useState<string>(
    producto?.unidad_venta ?? "unidad",
  );
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [orden, setOrden] = useState(
    producto?.orden != null ? String(producto.orden) : "0",
  );
  const [imagenes, setImagenes] = useState<string[]>(producto?.imagenes ?? []);
  const [imagenMiniatura, setImagenMiniatura] = useState(
    producto?.imagen_miniatura ?? "",
  );
  const [fotos, setFotos] = useState<string[]>(
    producto?.fotos_referencia ?? [],
  );
  const [aplicaciones, setAplicaciones] = useState<Set<string>>(
    new Set(producto?.producto_aplicacion?.map((a) => a.aplicacion_id) ?? []),
  );
  const [variantes, setVariantes] = useState<VarianteRow[]>(
    (producto?.variantes ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((v) => ({
        _key: uid(),
        id: v.id,
        tipo: v.tipo as VarianteRow["tipo"],
        nombre: v.nombre,
        codigo: v.codigo ?? "",
        swatch_hex: v.swatch_hex ?? "#cbb89c",
        swatch_url: v.swatch_url ?? "",
        sku: v.sku ?? "",
        precio_override: v.precio_override != null ? String(v.precio_override) : "",
        stock: v.stock != null ? String(v.stock) : "",
        activo: v.activo,
      })),
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destacadoError, setDestacadoError] = useState<string | null>(null);

  const rubro = opciones.rubros.find((r) => r.id === rubroId);
  const esTelas = rubro?.slug === "telas";
  const categoriasDelRubro = opciones.categorias.filter(
    (c) => c.rubro_id === rubroId,
  );

  // Candidatas para la miniatura de la card: fotos de colores + imágenes del producto.
  const miniaturaOpciones = (() => {
    const seen = new Set<string>();
    const todas = [
      ...variantes
        .filter((v) => v.swatch_url)
        .map((v) => ({ url: v.swatch_url, label: v.nombre.trim() || "Color" })),
      ...imagenes.map((u) => ({ url: u, label: "Imagen" })),
    ];
    return todas.filter(
      (o) => !!o.url && !seen.has(o.url) && (seen.add(o.url), true),
    );
  })();
  const miniaturaDefault =
    variantes.find((v) => v.tipo === "color" && v.swatch_url)?.swatch_url ||
    imagenes[0] ||
    "";

  async function subir(files: FileList | null, destino: "img" | "foto") {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const path = `${uid()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("productos")
        .upload(path, file);
      if (upErr) {
        setError(`No se pudo subir ${file.name}. ¿Aplicaste la migración 0005?`);
        continue;
      }
      const { data } = supabase.storage.from("productos").getPublicUrl(path);
      if (destino === "img") setImagenes((p) => [...p, data.publicUrl]);
      else setFotos((p) => [...p, data.publicUrl]);
    }
    setUploading(false);
  }

  async function subirVarianteFoto(key: string, files: FileList | null) {
    if (!files || !files[0]) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const file = files[0];
    const path = `${uid()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: upErr } = await supabase.storage
      .from("productos")
      .upload(path, file);
    if (upErr) {
      setError("No se pudo subir la foto. ¿Aplicaste la migración 0005?");
    } else {
      const { data } = supabase.storage.from("productos").getPublicUrl(path);
      setVar(key, { swatch_url: data.publicUrl });
    }
    setUploading(false);
  }

  function addVariante() {
    setVariantes((p) => [
      ...p,
      {
        _key: uid(),
        tipo: esTelas ? "color" : "medida",
        nombre: "",
        codigo: "",
        swatch_hex: "#cbb89c",
        swatch_url: "",
        sku: "",
        precio_override: "",
        stock: "",
        activo: true,
      },
    ]);
  }

  function setVar(key: string, patch: Partial<VarianteRow>) {
    setVariantes((p) =>
      p.map((v) => (v._key === key ? { ...v, ...patch } : v)),
    );
  }

  function delVar(key: string) {
    setVariantes((p) => p.filter((v) => v._key !== key));
  }

  function toggleApp(id: string) {
    setAplicaciones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await guardarProducto({
      id: producto?.id,
      nombre,
      codigo: codigo.trim() || null,
      rubro_id: rubroId,
      categoria_id: categoriaId || null,
      descripcion: descripcion.trim() || null,
      ficha_tecnica: fichaTecnica.trim() || null,
      precio_base: precioBase === "" ? null : Number(precioBase),
      unidad_venta: unidad,
      imagenes,
      imagen_miniatura: imagenMiniatura || null,
      fotos_referencia: fotos,
      destacado,
      activo,
      orden: orden === "" ? 0 : Number(orden),
      aplicaciones: esTelas ? [...aplicaciones] : [],
      variantes: variantes
        .filter((v) => v.nombre.trim())
        .map((v, i) => ({
          id: v.id,
          tipo: v.tipo,
          nombre: v.nombre.trim(),
          codigo: v.codigo.trim() || null,
          swatch_hex: v.tipo === "color" ? v.swatch_hex || null : null,
          swatch_url: v.swatch_url || null,
          sku: v.sku.trim() || null,
          precio_override:
            v.precio_override === "" ? null : Number(v.precio_override),
          stock: v.stock === "" ? null : Number(v.stock),
          activo: v.activo,
          orden: i,
        })),
    });
    if ("error" in res) {
      setError(res.error);
      setSaving(false);
      return;
    }
    toast(producto ? "Cambios guardados" : "Producto creado con éxito");
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)] leading-tight text-espresso">
          {producto ? "Editar producto" : "Nuevo producto"}
        </h1>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-bark">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="h-4 w-4 accent-[#a97c54]"
              />
              Activo
            </label>
            <label className="flex items-center gap-2 text-sm text-bark">
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) => {
                  if (e.target.checked && destacadosCount >= 4) {
                    setDestacadoError(
                      "Ya hay 4 productos destacados. Quitá uno antes.",
                    );
                    return;
                  }
                  setDestacadoError(null);
                  setDestacado(e.target.checked);
                }}
                className="h-4 w-4 accent-[#a97c54]"
              />
              Destacado
            </label>
          </div>
          {destacadoError && (
            <p className="max-w-[240px] text-right font-mono text-[11px] text-[#b5483d]">
              {destacadoError}
            </p>
          )}
        </div>
      </div>

      {/* Datos básicos */}
      <section className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className={label}>Nombre *</span>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={input}
          />
        </label>
        <label className="block space-y-2">
          <span className={label}>Código</span>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className={input}
          />
        </label>
        <label className="block space-y-2">
          <span className={label}>Orden</span>
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className={input}
          />
        </label>
        <label className="block space-y-2">
          <span className={label}>Rubro *</span>
          <select
            required
            value={rubroId}
            onChange={(e) => {
              setRubroId(e.target.value);
              setCategoriaId("");
            }}
            className={input}
          >
            <option value="">Elegí…</option>
            {opciones.rubros.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className={label}>Categoría</span>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            disabled={!rubroId}
            className={input}
          >
            <option value="">Sin categoría</option>
            {categoriasDelRubro.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className={label}>Precio base</span>
          <input
            type="number"
            step="0.01"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            placeholder="Vacío = se usa el de la variante"
            className={input}
          />
        </label>
        <label className="block space-y-2">
          <span className={label}>Unidad de venta</span>
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className={input}
          >
            <option value="unidad">Unidad</option>
            <option value="metro">Metro lineal</option>
            <option value="rollo">Rollo</option>
            <option value="juego">Juego</option>
          </select>
        </label>
      </section>

      {/* Aplicaciones (solo Telas) */}
      {esTelas && (
        <section>
          <span className={label}>Aplicaciones</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {opciones.aplicaciones.map((a) => {
              const on = aplicaciones.has(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleApp(a.id)}
                  className={`flex h-10 items-center rounded-sm border px-4 text-sm transition ${
                    on
                      ? "border-camel bg-camel text-paper"
                      : "border-line text-bark hover:border-camel-soft"
                  }`}
                >
                  {a.nombre}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Contenido */}
      <section className="grid gap-5">
        <label className="block space-y-2">
          <span className={label}>Descripción</span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className={`${input} h-auto resize-y py-2`}
          />
        </label>
        <label className="block space-y-2">
          <span className={label}>Ficha técnica</span>
          <textarea
            value={fichaTecnica}
            onChange={(e) => setFichaTecnica(e.target.value)}
            rows={3}
            className={`${input} h-auto resize-y py-2`}
          />
        </label>
      </section>

      {/* Imágenes */}
      <section className="grid gap-6 sm:grid-cols-2">
        <ImageZone
          titulo="Imágenes del producto"
          urls={imagenes}
          onUpload={(f) => subir(f, "img")}
          onRemove={(u) => setImagenes((p) => p.filter((x) => x !== u))}
          uploading={uploading}
        />
        <ImageZone
          titulo="Fotos de referencia"
          urls={fotos}
          onUpload={(f) => subir(f, "foto")}
          onRemove={(u) => setFotos((p) => p.filter((x) => x !== u))}
          uploading={uploading}
        />
      </section>

      {/* Variantes */}
      <section>
        <div className="flex items-center justify-between">
          <span className={label}>
            Variantes {esTelas ? "(colores)" : "(medidas / modelos)"}
          </span>
          <button
            type="button"
            onClick={addVariante}
            className="flex h-9 items-center rounded-sm border border-line px-3 text-xs font-medium text-bark transition-colors hover:border-camel hover:text-camel"
          >
            + Agregar variante
          </button>
        </div>

        {variantes.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.12em] text-taupe">
                  <th className="py-2 pr-2 font-normal">Tipo</th>
                  <th className="py-2 pr-2 font-normal">Nombre</th>
                  <th className="py-2 pr-2 font-normal">Código</th>
                  <th className="py-2 pr-2 font-normal">Color</th>
                  <th className="py-2 pr-2 font-normal">Foto</th>
                  <th className="py-2 pr-2 font-normal">SKU</th>
                  <th className="py-2 pr-2 font-normal">Precio</th>
                  <th className="py-2 pr-2 font-normal">Stock</th>
                  <th className="py-2 pr-2 font-normal">Activo</th>
                  <th className="py-2 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {variantes.map((v) => (
                  <tr key={v._key} className="border-b border-line/60">
                    <td className="py-2 pr-2">
                      <select
                        value={v.tipo}
                        onChange={(e) =>
                          setVar(v._key, {
                            tipo: e.target.value as VarianteRow["tipo"],
                          })
                        }
                        className={`${cellInput} w-[90px]`}
                      >
                        <option value="color">color</option>
                        <option value="medida">medida</option>
                        <option value="modelo">modelo</option>
                      </select>
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        value={v.nombre}
                        onChange={(e) =>
                          setVar(v._key, { nombre: e.target.value })
                        }
                        className={`${cellInput} min-w-[120px]`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        value={v.codigo}
                        onChange={(e) =>
                          setVar(v._key, { codigo: e.target.value })
                        }
                        className={`${cellInput} w-[90px]`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      {v.tipo === "color" ? (
                        <input
                          type="color"
                          value={v.swatch_hex}
                          onChange={(e) =>
                            setVar(v._key, { swatch_hex: e.target.value })
                          }
                          className="h-9 w-12 cursor-pointer rounded-sm border border-line bg-paper"
                          aria-label="Color"
                        />
                      ) : (
                        <span className="text-taupe">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      {v.swatch_url ? (
                        <span className="relative inline-block h-9 w-9">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={v.swatch_url}
                            alt=""
                            className="h-9 w-9 rounded-sm object-cover ring-1 ring-line"
                          />
                          <button
                            type="button"
                            onClick={() => setVar(v._key, { swatch_url: "" })}
                            aria-label="Quitar foto"
                            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-espresso/80 text-[9px] text-cream"
                          >
                            ✕
                          </button>
                        </span>
                      ) : (
                        <label className="flex h-9 w-16 cursor-pointer items-center justify-center rounded-sm border border-dashed border-line text-[10px] text-taupe transition-colors hover:border-camel hover:text-camel">
                          + foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              subirVarianteFoto(v._key, e.target.files)
                            }
                            className="hidden"
                          />
                        </label>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        value={v.sku}
                        onChange={(e) => setVar(v._key, { sku: e.target.value })}
                        className={`${cellInput} w-[100px]`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        step="0.01"
                        value={v.precio_override}
                        onChange={(e) =>
                          setVar(v._key, { precio_override: e.target.value })
                        }
                        className={`${cellInput} w-[90px]`}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        step="0.01"
                        value={v.stock}
                        onChange={(e) =>
                          setVar(v._key, { stock: e.target.value })
                        }
                        className={`${cellInput} w-[70px]`}
                      />
                    </td>
                    <td className="py-2 pr-2 text-center">
                      <input
                        type="checkbox"
                        checked={v.activo}
                        onChange={(e) =>
                          setVar(v._key, { activo: e.target.checked })
                        }
                        className="h-4 w-4 accent-[#a97c54]"
                      />
                    </td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => delVar(v._key)}
                        aria-label="Quitar variante"
                        className="text-taupe hover:text-[#b5483d]"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Miniatura de la card (foto del catálogo) */}
      <section>
        <span className={label}>Miniatura de la card</span>
        <p className="mt-1 max-w-[60ch] text-xs text-taupe">
          Foto que se muestra en las cards del catálogo. Por defecto usa la del
          primer color cargado; elegí otra si querés.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setImagenMiniatura("")}
            className={`relative h-24 w-24 overflow-hidden rounded-sm ring-1 transition ${
              imagenMiniatura === ""
                ? "ring-2 ring-camel"
                : "ring-line hover:ring-camel-soft"
            }`}
          >
            {miniaturaDefault ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={miniaturaDefault}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-sand text-[10px] text-taupe">
                sin foto
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-espresso/75 py-0.5 text-center font-mono text-[9px] uppercase tracking-wide text-cream">
              Auto
            </span>
          </button>

          {miniaturaOpciones.map((o) => (
            <button
              key={o.url}
              type="button"
              onClick={() => setImagenMiniatura(o.url)}
              title={o.label}
              className={`relative h-24 w-24 overflow-hidden rounded-sm ring-1 transition ${
                imagenMiniatura === o.url
                  ? "ring-2 ring-camel"
                  : "ring-line hover:ring-camel-soft"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={o.url}
                alt={o.label}
                className="h-full w-full object-cover"
              />
            </button>
          ))}

          {miniaturaOpciones.length === 0 && (
            <p className="self-center font-mono text-xs text-taupe">
              Subí imágenes o fotos de color para poder elegir la miniatura.
            </p>
          )}
        </div>
      </section>

      {error && (
        <p className="font-mono text-sm text-[#b5483d]">{error}</p>
      )}

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex h-12 items-center justify-center rounded-sm bg-espresso px-8 text-sm font-medium text-cream transition-colors hover:bg-bark disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="flex h-12 items-center rounded-sm border border-line px-6 text-sm text-bark transition-colors hover:border-camel-soft"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function ImageZone({
  titulo,
  urls,
  onUpload,
  onRemove,
  uploading,
}: {
  titulo: string;
  urls: string[];
  onUpload: (files: FileList | null) => void;
  onRemove: (url: string) => void;
  uploading: boolean;
}) {
  return (
    <div>
      <span className={label}>{titulo}</span>
      <div className="mt-3 flex flex-wrap gap-2">
        {urls.map((u) => (
          <div
            key={u}
            className="relative h-20 w-20 overflow-hidden rounded-sm ring-1 ring-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(u)}
              aria-label="Quitar"
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-espresso/80 text-[10px] text-cream"
            >
              ✕
            </button>
          </div>
        ))}
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-line text-center text-[10px] text-taupe transition-colors hover:border-camel hover:text-camel">
          {uploading ? "Subiendo…" : "+ Subir"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
