"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { KeyRound, Loader2, Power, X } from "lucide-react";

import { RoleGuard } from "@/components/shared/role-guard";
import { ErrorBanner } from "@/components/shared/error-banner";
import UserAvatar from "@/components/shared/user-avatar";
import { InsigniaEstado } from "@/components/ui/insignia-estado";
import { TablaDatos, type Columna } from "@/components/ui/tabla-datos";
import { avisar } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { mensajeError } from "@/lib/api";
import {
  ETIQUETA_ROL,
  cambiarEstadoUsuario,
  filtrarUsuarios,
  formatearUltimoAcceso,
  listarUsuarios,
  restablecerPasswordUsuario,
  type RolCuenta,
  type UsuarioSistema,
} from "@/store/usuarios-store";

const ESTILO_ROL: Record<RolCuenta, string> = {
  ADM: "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
  PROF: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20",
  ALU: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
};

const claseControl =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/20";

function InsigniaRol({ rol }: { rol: RolCuenta }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${ESTILO_ROL[rol]}`}>
      {ETIQUETA_ROL[rol]}
    </span>
  );
}

function Identidad({ usuario, esYo }: { usuario: UsuarioSistema; esYo: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar nombre={usuario.nombre} className="h-9 w-9 bg-brand-green-soft text-sm font-bold text-brand-green dark:text-brand-lime-light" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">
          {usuario.nombre}
          {esYo && <span className="ml-1.5 text-xs font-medium text-muted">(tú)</span>}
        </p>
        <p className="truncate text-xs text-muted">
          @{usuario.usuario}
          <span className="2xl:hidden"> · {usuario.email}</span>
        </p>
      </div>
    </div>
  );
}

const CATEGORIAS_VISIBLES = 2;

function Categorias({ usuario }: { usuario: UsuarioSistema }) {
  if (usuario.rol === "ADM") return <span className="text-xs text-muted">Todas</span>;
  if (usuario.categorias.length === 0) return <span className="text-xs text-muted">Sin categoría</span>;
  const restantes = usuario.categorias.length - CATEGORIAS_VISIBLES;
  return (
    <div className="flex flex-wrap gap-1" title={usuario.categorias.join(", ")}>
      {usuario.categorias.slice(0, CATEGORIAS_VISIBLES).map((nombre) => (
        <span key={nombre} className="whitespace-nowrap rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink">
          {nombre}
        </span>
      ))}
      {restantes > 0 && <span className="whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium text-muted">+{restantes}</span>}
    </div>
  );
}

function Acceso({ proveedores }: { proveedores: string[] }) {
  const google = proveedores.includes("google");
  const password = proveedores.includes("email") || proveedores.length === 0;
  return (
    <span className="whitespace-nowrap text-xs text-body">
      {[password && "Contraseña", google && "Google"].filter(Boolean).join(" · ")}
    </span>
  );
}

function Resumen({ etiqueta, valor, activo, onClick }: { etiqueta: string; valor: number; activo: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`rounded-xl border px-4 py-3 text-left transition ${
        activo ? "border-primary-light bg-primary-light/5 ring-1 ring-primary-light/30" : "border-line bg-surface hover:border-primary-light/50"
      }`}
    >
      <p className="text-xs font-medium text-muted">{etiqueta}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{valor}</p>
    </button>
  );
}

export default function UsuariosAdminPage() {
  const { session } = useAuth();
  const miId = session?.usuario.id;
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [rol, setRol] = useState<RolCuenta | "todos">("todos");
  const [estado, setEstado] = useState<"todos" | "activo" | "inactivo">("todos");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [aRestablecer, setARestablecer] = useState<UsuarioSistema | null>(null);
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    let vigente = true;
    listarUsuarios()
      .then((lista) => {
        if (vigente) setUsuarios(lista);
      })
      .catch((err) => {
        if (vigente) setError(mensajeError(err, "No se pudo cargar la lista de usuarios."));
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, []);

  const filtrados = useMemo(() => filtrarUsuarios(usuarios, { texto, rol, estado }), [usuarios, texto, rol, estado]);
  const conteo = useMemo(
    () => ({
      total: usuarios.length,
      ADM: usuarios.filter((u) => u.rol === "ADM").length,
      PROF: usuarios.filter((u) => u.rol === "PROF").length,
      ALU: usuarios.filter((u) => u.rol === "ALU").length,
      inactivos: usuarios.filter((u) => !u.activo).length,
    }),
    [usuarios],
  );

  async function alternarEstado(usuario: UsuarioSistema) {
    const activar = !usuario.activo;
    if (!activar) {
      const ok = await confirm({
        title: `¿Desactivar a ${usuario.nombre}?`,
        message: "No podrá iniciar sesión hasta que vuelvas a activar su cuenta. Sus datos no se borran.",
        confirmLabel: "Desactivar",
        variant: "danger",
      });
      if (!ok) return;
    }
    setProcesandoId(usuario.id);
    try {
      await cambiarEstadoUsuario(usuario.id, activar);
      setUsuarios((lista) => lista.map((u) => (u.id === usuario.id ? { ...u, activo: activar } : u)));
      avisar(activar ? `Se activó la cuenta de ${usuario.nombre}.` : `Se desactivó la cuenta de ${usuario.nombre}.`);
    } catch (err) {
      setError(mensajeError(err, "No se pudo cambiar el estado de la cuenta."));
    } finally {
      setProcesandoId(null);
    }
  }

  const acciones = (usuario: UsuarioSistema) => {
    const esYo = usuario.id === miId;
    const ocupado = procesandoId === usuario.id;
    return (
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={() => setARestablecer(usuario)}
          title="Restablecer contraseña"
          aria-label={`Restablecer contraseña de ${usuario.nombre}`}
          className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <KeyRound className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void alternarEstado(usuario)}
          disabled={(esYo && usuario.activo) || ocupado}
          title={esYo && usuario.activo ? "No puedes desactivar tu propia cuenta" : usuario.activo ? "Desactivar cuenta" : "Activar cuenta"}
          aria-label={`${usuario.activo ? "Desactivar" : "Activar"} la cuenta de ${usuario.nombre}`}
          className={`grid h-8 w-8 place-items-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            usuario.activo ? "text-muted hover:bg-danger-light hover:text-danger" : "text-success hover:bg-success/10"
          }`}
        >
          {ocupado ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
        </button>
      </div>
    );
  };

  const columnas: Columna<UsuarioSistema>[] = [
    { clave: "nombre", encabezado: "Usuario", celda: (u) => <Identidad usuario={u} esYo={u.id === miId} />, orden: (u) => u.nombre },
    { clave: "email", encabezado: "Correo", celda: (u) => <span className="text-body">{u.email}</span>, orden: (u) => u.email, clase: "hidden 2xl:table-cell" },
    { clave: "rol", encabezado: "Rol", celda: (u) => <InsigniaRol rol={u.rol} />, orden: (u) => u.rol },
    { clave: "categorias", encabezado: "Categoría", celda: (u) => <Categorias usuario={u} />, orden: (u) => u.categorias[0] ?? "" },
    { clave: "acceso", encabezado: "Acceso", celda: (u) => <Acceso proveedores={u.proveedores} />, clase: "hidden 2xl:table-cell" },
    {
      clave: "ultimoAcceso",
      encabezado: "Último ingreso",
      celda: (u) => <span className="whitespace-nowrap text-body first-letter:uppercase">{formatearUltimoAcceso(u.ultimoAcceso)}</span>,
      orden: (u) => (u.ultimoAcceso ? new Date(u.ultimoAcceso).getTime() : 0),
      clase: "hidden lg:table-cell",
    },
    { clave: "estado", encabezado: "Estado", celda: (u) => <InsigniaEstado estado={u.activo ? "activo" : "inactivo"} />, orden: (u) => (u.activo ? 0 : 1) },
    { clave: "acciones", encabezado: "", celda: acciones, clase: "w-24 text-right" },
  ];

  const tarjeta = (u: UsuarioSistema) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Identidad usuario={u} esYo={u.id === miId} />
        <InsigniaEstado estado={u.activo ? "activo" : "inactivo"} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <InsigniaRol rol={u.rol} />
        <Categorias usuario={u} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs text-muted">
          Último ingreso: {formatearUltimoAcceso(u.ultimoAcceso)}
        </p>
        {acciones(u)}
      </div>
    </div>
  );

  return (
    <RoleGuard allowedRoles={["administrador"]}>
      <div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Usuarios</h1>
          <p className="mt-1 text-sm text-muted">Todas las cuentas con acceso al sistema: administradores, profesores y alumnos.</p>
        </header>

        <div className="mb-5">
          <ErrorBanner mensaje={error} onCerrar={() => setError(null)} />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Resumen etiqueta={`Total${conteo.inactivos ? ` · ${conteo.inactivos} ${conteo.inactivos === 1 ? "inactivo" : "inactivos"}` : ""}`} valor={conteo.total} activo={rol === "todos"} onClick={() => setRol("todos")} />
          <Resumen etiqueta="Administradores" valor={conteo.ADM} activo={rol === "ADM"} onClick={() => setRol("ADM")} />
          <Resumen etiqueta="Profesores" valor={conteo.PROF} activo={rol === "PROF"} onClick={() => setRol("PROF")} />
          <Resumen etiqueta="Alumnos" valor={conteo.ALU} activo={rol === "ALU"} onClick={() => setRol("ALU")} />
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-sm lg:flex-row lg:items-center">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre, usuario, correo o categoría..."
            aria-label="Buscar usuarios"
            className={`${claseControl} lg:w-96`}
          />
          <select value={rol} onChange={(e) => setRol(e.target.value as RolCuenta | "todos")} aria-label="Filtrar por rol" className={`${claseControl} lg:w-48`}>
            <option value="todos">Todos los roles</option>
            <option value="ADM">Administradores</option>
            <option value="PROF">Profesores</option>
            <option value="ALU">Alumnos</option>
          </select>
          <select value={estado} onChange={(e) => setEstado(e.target.value as typeof estado)} aria-label="Filtrar por estado" className={`${claseControl} lg:w-44`}>
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        <TablaDatos
          etiqueta="Usuarios"
          filas={filtrados}
          columnas={columnas}
          claveFila={(u) => u.id}
          tarjeta={tarjeta}
          cargando={cargando}
          ordenInicial="nombre"
          vacio={<p className="py-10 text-center text-sm text-muted">No hay usuarios que coincidan con la búsqueda.</p>}
        />

        {aRestablecer && <DialogoPassword usuario={aRestablecer} onCerrar={() => setARestablecer(null)} />}
        {dialog}
      </div>
    </RoleGuard>
  );
}

function DialogoPassword({ usuario, onCerrar }: { usuario: UsuarioSistema; onCerrar: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password.trim() !== password) return setError("La contraseña no puede empezar ni terminar con espacios.");
    setGuardando(true);
    try {
      await restablecerPasswordUsuario(usuario.id, password);
      avisar(`Se cambió la contraseña de ${usuario.nombre}.`);
      onCerrar();
    } catch (err) {
      setError(mensajeError(err, "No se pudo cambiar la contraseña."));
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="titulo-password">
      <form onSubmit={guardar} className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="titulo-password" className="text-lg font-semibold text-ink">Restablecer contraseña</h2>
            <p className="mt-1 text-sm text-body">
              {usuario.nombre} · <span className="text-muted">@{usuario.usuario}</span>
            </p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="rounded-md p-1 text-muted hover:bg-surface-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Nueva contraseña</span>
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoFocus
            autoComplete="off"
            placeholder="Mínimo 6 caracteres"
            className={claseControl}
          />
        </label>
        <p className="mt-2 text-xs text-muted">Compártela con el usuario; podrá cambiarla luego desde Configuración.</p>
        {error && <p role="alert" className="mt-3 text-sm font-medium text-danger">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCerrar} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-muted">
            Cancelar
          </button>
          <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-70">
            {guardando && <Loader2 className="h-4 w-4 animate-spin" />} Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
