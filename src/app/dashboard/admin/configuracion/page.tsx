import { RoleGuard } from "@/components/shared/role-guard";
import ConfiguracionScreen from "@/components/screens/configuracion-screen";

export default function ConfiguracionAdminPage() {
  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <ConfiguracionScreen />
    </RoleGuard>
  );
}