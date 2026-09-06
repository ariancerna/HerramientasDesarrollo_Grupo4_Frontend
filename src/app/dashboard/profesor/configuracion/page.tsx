import { RoleGuard } from "@/components/shared/role-guard";
import ConfiguracionScreen from "@/components/screens/configuracion-screen";

export default function ConfiguracionProfesorPage() {
  return (
    <RoleGuard allowedRoles={["profesor"]}>
      <ConfiguracionScreen />
    </RoleGuard>
  );
}
