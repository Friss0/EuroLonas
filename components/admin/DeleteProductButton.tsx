"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { eliminarProducto } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

export function DeleteProductButton({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function onDelete() {
    if (!confirm(`¿Borrar "${nombre}"? Esta acción no se puede deshacer.`))
      return;
    startTransition(async () => {
      const res = await eliminarProducto(id);
      if ("error" in res) {
        setMsg(res.error);
      } else {
        toast("Producto borrado");
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="flex h-9 items-center gap-1.5 rounded-sm bg-[#b5483d] px-3 text-xs font-medium text-cream transition-colors hover:bg-[#9d3e35] disabled:opacity-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
        {pending ? "…" : "Borrar"}
      </button>
      {msg && (
        <span className="mt-1 max-w-[200px] text-right font-mono text-[10px] text-[#b5483d]">
          {msg}
        </span>
      )}
    </div>
  );
}
