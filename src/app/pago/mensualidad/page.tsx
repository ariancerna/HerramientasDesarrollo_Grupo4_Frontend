import type { Metadata } from "next";
import { RoleGuard } from "@/components/shared/role-guard";
import { CheckoutMensualidad } from "@/components/pagos/checkout-mensualidad";

export const metadata: Metadata = { title: "Pagar mensualidad" };

export default async function PagarMensualidadPage({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  const { periodo } = await searchParams;
  const periodoValido = typeof periodo === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(periodo) ? periodo : undefined;

  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <CheckoutMensualidad periodo={periodoValido} />
    </RoleGuard>
  );
}
