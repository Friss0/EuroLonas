"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cambiarEstadoPedido } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

const ESTADOS = [
  "pendiente",
  "pagado",
  "preparando",
  "enviado",
  "cancelado",
];

export function EstadoSelect({
  pedidoId,
  estado,
}: {
  pedidoId: string;
  estado: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [value, setValue] = useState(estado);
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value;
    setValue(nuevo);
    startTransition(async () => {
      await cambiarEstadoPedido(pedidoId, nuevo);
      toast("Estado del pedido actualizado");
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={pending}
        aria-label="Estado del pedido"
        className="h-9 cursor-pointer appearance-none rounded-sm border border-line bg-paper pl-3 pr-8 text-xs text-bark capitalize outline-none transition-colors hover:border-camel-soft focus:border-camel disabled:opacity-50"
      >
        {ESTADOS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-taupe"
        aria-hidden
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
