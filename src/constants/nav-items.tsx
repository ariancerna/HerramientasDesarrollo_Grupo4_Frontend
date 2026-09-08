import type { Role } from "@/types";

export type IconName =
    | "home"
    | "profile"
    | "students"
    | "attendance"
    | "tag"
    | "chart"
    | "settings"
    | "teacher"
    | "location"
    | "calendar"
    | "payments"
    | "evaluation"
    | "announcement";

export interface NavItem {
    label: string;
    shortLabel: string;
    href: string;
    icon: IconName;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
    administrador: [
        { label: "Inicio", shortLabel: "Inicio", href: "/dashboard/admin", icon: "home" },
        { label: "Alumnos", shortLabel: "Alumnos", href: "/dashboard/admin/alumnos", icon: "students" },
        { label: "Profesores", shortLabel: "Profesores", href: "/dashboard/admin/profesores", icon: "teacher" },
        { label: "Asistencia", shortLabel: "Asistencia", href: "/dashboard/admin/asistencia", icon: "attendance" },
        { label: "Pagos", shortLabel: "Pagos", href: "/dashboard/admin/pagos", icon: "payments" },
        { label: "Categorías", shortLabel: "Categorías", href: "/dashboard/admin/categorias", icon: "tag" },
        { label: "Sedes", shortLabel: "Sedes", href: "/dashboard/admin/sedes", icon: "location" },
        { label: "Reportes", shortLabel: "Reportes", href: "/dashboard/admin/reportes", icon: "chart" },
        { label: "Configuración", shortLabel: "Ajustes", href: "/dashboard/admin/configuracion", icon: "settings" },
    ],
    profesor: [
        { label: "Inicio", shortLabel: "Inicio", href: "/dashboard/profesor", icon: "home" },
        { label: "Registrar asistencia", shortLabel: "Asistencia", href: "/dashboard/profesor/asistencia", icon: "attendance" },
        { label: "Alumnos", shortLabel: "Alumnos", href: "/dashboard/profesor/alumnos", icon: "students" },
        { label: "Mi horario", shortLabel: "Horario", href: "/dashboard/profesor/horario", icon: "calendar" },
        { label: "Evaluaciones", shortLabel: "Evaluaciones", href: "/dashboard/profesor/evaluaciones", icon: "evaluation" },
        { label: "Anuncios", shortLabel: "Anuncios", href: "/dashboard/profesor/anuncios", icon: "announcement" },
        { label: "Configuración", shortLabel: "Ajustes", href: "/dashboard/profesor/configuracion", icon: "settings" },
    ],
    alumno: [
        { label: "Inicio", shortLabel: "Inicio", href: "/dashboard/alumno", icon: "home" },
        { label: "Mi perfil", shortLabel: "Perfil", href: "/dashboard/alumno/perfil", icon: "profile" },
        { label: "Mi historial", shortLabel: "Historial", href: "/dashboard/alumno/historial", icon: "attendance" },
        { label: "Mis pagos", shortLabel: "Pagos", href: "/dashboard/alumno/pagos", icon: "payments" },
        { label: "Calendario", shortLabel: "Agenda", href: "/dashboard/alumno/calendario", icon: "calendar" },
        { label: "Configuración", shortLabel: "Ajustes", href: "/dashboard/alumno/configuracion", icon: "settings" },
    ],
};

export const ROLE_LABELS: Record<Role, string> = {
    administrador: "Administrador",
    profesor: "Profesor",
    alumno: "Alumno",
};

export function NavIcon({ name, className }: { name: IconName; className?: string }) {
    const cls = className ?? "h-5 w-5 shrink-0";
    if (name === "home")
        return (
            <Icon className={cls}>
                <path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" />
            </Icon>
        );
    if (name === "profile")
        return (
            <Icon className={cls}>
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20c.7-3.8 3-6 7-6s6.3 2.2 7 6" />
            </Icon>
        );
    if (name === "students")
        return (
            <Icon className={cls}>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5M15 6.2a3 3 0 0 1 0 5.6M16.5 14.4c2.2.6 3.5 2.1 4 4.6" />
            </Icon>
        );
    if (name === "attendance")
        return (
            <Icon className={cls}>
                <path d="M7 3v3M17 3v3M4 9h16" />
                <rect x="4" y="5" width="16" height="16" rx="3" />
                <path d="m8.5 15 2 2 4.5-5" />
            </Icon>
        );
    if (name === "tag")
        return (
            <Icon className={cls}>
                <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5l8.6 8.6a2 2 0 0 0 2.8 0l5.7-5.7a2 2 0 0 0 0-2.8Z" />
                <circle cx="8" cy="8" r="1.4" />
            </Icon>
        );
    if (name === "chart")
        return (
            <Icon className={cls}>
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
            </Icon>
        );
    if (name === "teacher")
        return (
            <Icon className={cls}>
                <circle cx="12" cy="7" r="3" />
                <path d="M5 20c.7-3.8 3-6 7-6s6.3 2.2 7 6" />
                <path d="M9 20h6" />
            </Icon>
        );
    if (name === "location")
        return (
            <Icon className={cls}>
                <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.3" />
            </Icon>
        );
    if (name === "calendar")
        return (
            <Icon className={cls}>
                <rect x="4" y="5" width="16" height="16" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </Icon>
        );
    if (name === "payments")
        return (
            <Icon className={cls}>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="M3 9h18M7 15h4" />
            </Icon>
        );
    if (name === "evaluation")
        return (
            <Icon className={cls}>
                <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
            </Icon>
        );
    if (name === "announcement")
        return (
            <Icon className={cls}>
                <path d="M4 5h16v11H8l-4 4zM8 9h8M8 12h5" />
            </Icon>
        );
    return (
        <Icon className={cls}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </Icon>
    );
}
function Icon({ children, className }: { children: React.ReactNode; className: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {children}
            </g>
        </svg>
    );
}
