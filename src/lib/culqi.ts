/**
 * Integración con Culqi Checkout Custom (https://js.culqi.com/checkout-js).
 * El checkout tokeniza la tarjeta en el navegador; el token se envía al
 * backend, que es el único que conoce la llave secreta y crea el cargo.
 * Sin llave pública la app usa el formulario del modo demostración.
 */

const CULQI_SCRIPT_URL = "https://js.culqi.com/checkout-js";

export const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY?.trim() ?? "";

export interface TokenCulqi {
  id: string;
  email: string;
}

interface ErrorCulqi {
  user_message?: string;
  merchant_message?: string;
}

interface InstanciaCulqi {
  token?: TokenCulqi;
  error?: ErrorCulqi;
  culqi?: () => void;
  closeCheckout?: () => void;
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    CulqiCheckout?: new (publicKey: string, config: unknown) => InstanciaCulqi;
  }
}

let cargaScript: Promise<void> | null = null;

function cargarScript(): Promise<void> {
  if (window.CulqiCheckout) return Promise.resolve();
  cargaScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CULQI_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      cargaScript = null;
      script.remove();
      reject(new Error("No se pudo cargar la pasarela de pago. Revisa tu conexión."));
    };
    document.head.appendChild(script);
  });
  return cargaScript;
}

interface AbrirCheckoutOpciones {
  titulo: string;
  /** Importe en soles; Culqi lo recibe en céntimos. */
  monto: number;
}

/**
 * Abre el checkout de Culqi y resuelve con el token de la tarjeta.
 * Resuelve null si el usuario cierra el formulario sin pagar.
 */
export async function abrirCheckoutCulqi({ titulo, monto }: AbrirCheckoutOpciones): Promise<TokenCulqi | null> {
  if (!CULQI_PUBLIC_KEY) {
    throw new Error("La pasarela de pago no está configurada (falta NEXT_PUBLIC_CULQI_PUBLIC_KEY).");
  }
  await cargarScript();
  const Checkout = window.CulqiCheckout;
  if (!Checkout) throw new Error("No se pudo iniciar la pasarela de pago.");

  return new Promise<TokenCulqi | null>((resolve, reject) => {
    let terminado = false;
    const instancia = new Checkout(CULQI_PUBLIC_KEY, {
      settings: { title: titulo, currency: "PEN", amount: Math.round(monto * 100) },
      options: {
        lang: "auto",
        installments: false,
        modal: true,
        paymentMethods: { tarjeta: true },
      },
      appearance: {
        theme: "default",
        menuType: "sidebar",
        variables: { colorPrimary: "#2563eb", borderRadius: "8px" },
      },
    });

    instancia.culqi = () => {
      if (terminado) return;
      if (instancia.token) {
        terminado = true;
        const token = instancia.token;
        instancia.close();
        resolve({ id: token.id, email: token.email });
      } else if (instancia.error) {
        terminado = true;
        instancia.close();
        reject(new Error(instancia.error.user_message ?? "No se pudo procesar la tarjeta."));
      }
    };
    instancia.closeCheckout = () => {
      if (terminado) return;
      terminado = true;
      resolve(null);
    };
    instancia.open();
  });
}
