import { RoleGuard } from "@/components/shared/role-guard";
import ConfiguracionScreen from "@/components/screens/configuracion-screen";

export default function ConfiguracionAlumnoPage() {
  return (
    <RoleGuard allowedRoles={["alumno"]}>
      <ConfiguracionScreen />
    </RoleGuard>
  );
}
