<<<<<<< HEAD
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
=======
import { RoleGuard } from "@/components/shared/role-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard>{children}</RoleGuard>;
>>>>>>> origin/feature/sebastian
}
