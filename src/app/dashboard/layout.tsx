import { RoleGuard } from "@/components/shared/role-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard>{children}</RoleGuard>;
}
