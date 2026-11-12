"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { CodigoVerificacion } from "@/components/auth/codigo-verificacion";
import { claseCampo } from "@/components/forms/login-form";
import { ROUTES } from "@/constants/routes";
import { api, mensajeError } from "@/lib/api";

// Supabase solo permite pedir un código por correo cada 60 segundos.
const ESPERA_REENVIO = 60;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Paso = "correo" | "codigo" | "nueva" | "listo";

const ENCABEZADOS: Record<Paso, { titulo: string; subtitulo: string }> = {
  correo: {
    titulo: "Recuperar contraseña",
    subtitulo: "Ingresa el correo de tu cuenta y te enviaremos un código de verificación.",
  },
  codigo: { titulo: "Revisa tu correo", subtitulo: "" },
  nueva: {
    titulo: "Crea una nueva contraseña",
    subtitulo: "Tu código fue verificado. Elige una contraseña que recuerdes con facilidad.",
  },
  listo: {
    titulo: "Contraseña actualizada",
    subtitulo: "Ya puedes iniciar sesión con tu usuario y tu nueva contraseña.",
  },
};

const PASOS: Paso[] = ["correo", "codigo", "nueva"];

const claseBoton =
  "group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white shadow-[0_12px_24px_-12px_rgb(30_58_138/0.8)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70";

function formatoEspera(segundos: number) {
  return `0:${String(segundos).padStart(2, "0")}`;
}

/** Recuperar contraseña en tres pasos: correo → código → nueva contraseña. */
export function RecuperarPassword() {
  const [paso, setPaso] = useState<Paso>("correo");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [usuario, setUsuario] = useState("");

  const correoNormalizado = correo.trim().toLowerCase();
  const encabezado = ENCABEZADOS[paso];
  const subtitulo: ReactNode =
    paso === "codigo" ? (
      <>
        Ingresa el código de 6 dígitos que enviamos a <span className="font-semibold text-ink">{correoNormalizado}</span>.
      </>
    ) : (
      encabezado.subtitulo
    );

  return (
    <AuthShell
      titulo={encabezado.titulo}
      subtitulo={subtitulo}
      volver={{ href: ROUTES.LOGIN, etiqueta: "Volver a iniciar sesión" }}
    >
      {paso !== "listo" && <Progreso actual={PASOS.indexOf(paso)} />}

      {paso === "correo" && (
        <PasoCorreo
          correo={correo}
          onCorreo={setCorreo}
          onEnviado={() => {
            setCodigo("");
            setPaso("codigo");
          }}
        />
      )}

      {paso === "codigo" && (
        <PasoCodigo
          correo={correoNormalizado}
          codigo={codigo}
          onCodigo={setCodigo}
          onCambiarCorreo={() => setPaso("correo")}
          onVerificado={(token, nombreUsuario) => {
            setResetToken(token);
            setUsuario(nombreUsuario);
            setPaso("nueva");
          }}
        />
      )}

      {paso === "nueva" && <PasoNuevaPassword resetToken={resetToken} usuario={usuario} onGuardado={() => setPaso("listo")} />}

      {paso === "listo" && <PasoListo usuario={usuario} />}
    </AuthShell>
  );
}

/* ---------------------------------------------------------------- */

function Progreso({ actual }: { actual: number }) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-xs font-medium text-muted">
        Paso {actual + 1} de {PASOS.length}
      </p>
      <div className="grid grid-cols-3 gap-1.5" aria-hidden>
        {PASOS.map((p, i) => (
          <span key={p} className={`h-1 rounded-full ${i <= actual ? "bg-primary-light" : "bg-line"}`} />
        ))}
      </div>
    </div>
  );
}

function Alerta({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm font-medium text-danger">
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */

function PasoCorreo({ correo, onCorreo, onEnviado }: { correo: string; onCorreo: (v: string) => void; onEnviado: () => void }) {
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const normalizado = correo.trim().toLowerCase();
    if (!CORREO_VALIDO.test(normalizado)) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await api("/auth/password/forgot", { method: "POST", body: { correo: normalizado }, auth: false });
      onEnviado();
    } catch (err) {
      setError(mensajeError(err, "No se pudo enviar el código."));
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      <div>
        <label htmlFor="correo" className="mb-1.5 block text-sm font-semibold text-ink">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input
            id="correo"
            type="email"
            autoComplete="email"
            autoFocus
            value={correo}
            onChange={(e) => {
              onCorreo(e.target.value);
              setError("");
            }}
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={Boolean(error)}
            className={`${claseCampo} ${error ? "border-danger" : "border-line"}`}
          />
        </div>
      </div>

      {error && <Alerta>{error}</Alerta>}

      <button type="submit" disabled={enviando} className={claseBoton}>
        {enviando ? (
          <>
            <Loader2 className="h-[18px] w-[18px] animate-spin" /> Enviando código…
          </>
        ) : (
          <>
            Enviar código
            <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

/* ---------------------------------------------------------------- */

interface PasoCodigoProps {
  correo: string;
  codigo: string;
  onCodigo: (v: string) => void;
  onCambiarCorreo: () => void;
  onVerificado: (resetToken: string, usuario: string) => void;
}

function PasoCodigo({ correo, codigo, onCodigo, onCambiarCorreo, onVerificado }: PasoCodigoProps) {
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [verificando, setVerificando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [espera, setEspera] = useState(ESPERA_REENVIO);

  useEffect(() => {
    if (espera <= 0) return;
    const temporizador = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(temporizador);
  }, [espera]);

  async function verificar(valor = codigo) {
    if (valor.length !== 6) {
      setError("Ingresa los 6 dígitos del código.");
      return;
    }
    setError("");
    setAviso("");
    setVerificando(true);
    try {
      const data = await api<{ resetToken: string; usuario?: string }>("/auth/password/verify", {
        method: "POST",
        body: { correo, codigo: valor },
        auth: false,
      });
      onVerificado(data.resetToken, data.usuario ?? "");
    } catch (err) {
      setError(mensajeError(err, "El código no es válido."));
      setVerificando(false);
    }
  }

  async function reenviar() {
    if (espera > 0 || reenviando) return;
    setError("");
    setAviso("");
    setReenviando(true);
    try {
      await api("/auth/password/forgot", { method: "POST", body: { correo }, auth: false });
      onCodigo("");
      setAviso("Te enviamos un código nuevo. El anterior ya no es válido.");
      setEspera(ESPERA_REENVIO);
    } catch (err) {
      setError(mensajeError(err, "No se pudo reenviar el código."));
    } finally {
      setReenviando(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void verificar();
      }}
      noValidate
      className="space-y-5"
    >
      <CodigoVerificacion
        valor={codigo}
        onChange={(v) => {
          onCodigo(v);
          setError("");
        }}
        onCompleto={(v) => void verificar(v)}
        error={Boolean(error)}
        deshabilitado={verificando}
      />

      {error && <Alerta>{error}</Alerta>}
      {aviso && !error && (
        <p role="status" className="text-sm text-body">
          {aviso}
        </p>
      )}

      <button type="submit" disabled={verificando} className={claseBoton}>
        {verificando ? (
          <>
            <Loader2 className="h-[18px] w-[18px] animate-spin" /> Verificando…
          </>
        ) : (
          "Verificar código"
        )}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 text-sm">
        <p className="text-body">
          ¿No te llegó?{" "}
          {espera > 0 ? (
            <span className="text-muted">Reenviar en {formatoEspera(espera)}</span>
          ) : (
            <button type="button" onClick={reenviar} disabled={reenviando} className="font-semibold text-primary-light hover:underline disabled:opacity-60 dark:text-blue-300">
              {reenviando ? "Reenviando…" : "Reenviar código"}
            </button>
          )}
        </p>
        <button type="button" onClick={onCambiarCorreo} className="font-medium text-body hover:text-ink hover:underline">
          Cambiar correo
        </button>
      </div>
      <p className="-mt-2 text-xs text-muted">Revisa también la carpeta de spam. El código vence en 10 minutos.</p>
    </form>
  );
}

/* ---------------------------------------------------------------- */

function PasoNuevaPassword({ resetToken, usuario, onGuardado }: { resetToken: string; usuario: string; onGuardado: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password.trim() !== password) return setError("La contraseña no puede empezar ni terminar con espacios.");
    if (password !== confirmar) return setError("Las contraseñas no coinciden.");

    setError("");
    setGuardando(true);
    try {
      await api("/auth/password/reset", { method: "POST", body: { resetToken, nuevaPassword: password }, auth: false });
      onGuardado();
    } catch (err) {
      setError(mensajeError(err, "No se pudo actualizar la contraseña."));
      setGuardando(false);
    }
  }

  const tipo = visible ? "text" : "password";

  return (
    <form onSubmit={guardar} noValidate className="space-y-5">
      {usuario && (
        <div>
          <label htmlFor="usuario-cuenta" className="mb-1.5 block text-sm font-semibold text-ink">
            Usuario
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
            <input
              id="usuario-cuenta"
              type="text"
              value={usuario}
              readOnly
              tabIndex={-1}
              autoComplete="username"
              aria-readonly="true"
              className="h-12 w-full cursor-default rounded-xl border border-line bg-surface-muted pl-11 pr-11 text-[15px] font-medium text-ink outline-none"
            />
            <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          </div>
          <p className="mt-1.5 text-xs text-muted">Con este usuario iniciarás sesión.</p>
        </div>
      )}

      <div>
        <label htmlFor="nueva-password" className="mb-1.5 block text-sm font-semibold text-ink">
          Nueva contraseña
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input
            id="nueva-password"
            type={tipo}
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Mínimo 6 caracteres"
            className={`${claseCampo} pr-12 border-line`}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted transition-colors hover:text-ink"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmar-password" className="mb-1.5 block text-sm font-semibold text-ink">
          Confirmar contraseña
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
          <input
            id="confirmar-password"
            type={tipo}
            autoComplete="new-password"
            value={confirmar}
            onChange={(e) => {
              setConfirmar(e.target.value);
              setError("");
            }}
            placeholder="Repite la contraseña"
            className={`${claseCampo} border-line`}
          />
        </div>
      </div>

      {error && <Alerta>{error}</Alerta>}

      <button type="submit" disabled={guardando} className={claseBoton}>
        {guardando ? (
          <>
            <Loader2 className="h-[18px] w-[18px] animate-spin" /> Guardando…
          </>
        ) : (
          "Guardar contraseña"
        )}
      </button>
    </form>
  );
}

/* ---------------------------------------------------------------- */

function PasoListo({ usuario }: { usuario: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-muted px-4 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success/10 text-success">
          <Check className="h-5 w-5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Tu contraseña se cambió correctamente</p>
          {usuario && (
            <p className="truncate text-sm text-body">
              Usuario: <span className="font-medium text-ink">{usuario}</span>
            </p>
          )}
        </div>
      </div>
      <Link href={ROUTES.LOGIN} className={claseBoton}>
        Ir a iniciar sesión
        <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
