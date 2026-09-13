import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface DashboardWelcomeBannerProps {
  name: string;
  description: string;
  quote: string;
  action?: {
    href: string;
    label: string;
    mobileLabel?: string;
    icon?: ReactNode;
  };
}

export function DashboardWelcomeBanner({
  name,
  description,
  quote,
  action,
}: DashboardWelcomeBannerProps) {
  return (
    <section className="relative mt-1 min-h-52 overflow-hidden rounded-xl border border-white/10 bg-navy shadow-lg sm:min-h-64 sm:rounded-2xl lg:min-h-72">
      <Image
        src="/dashboard-volleyball-hero.png"
        alt=""
        fill
        preload
        sizes="(max-width: 1023px) calc(100vw - 2rem), (max-width: 1535px) calc(100vw - 21rem), 80rem"
        className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#031426] via-[#031426]/92 to-[#031426]/20 sm:via-[#031426]/85 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#031426]/45 via-transparent to-[#031426]/10" />
      <div className="absolute bottom-0 left-0 h-1 w-16 bg-brand-lime sm:w-24" aria-hidden="true" />

      <div className="relative z-10 flex min-h-52 flex-col items-start justify-center px-5 py-6 sm:min-h-64 sm:px-8 sm:py-9 lg:min-h-72 lg:px-10">
        <div className="max-w-[78%] sm:max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            ¡Hola, {name}!
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-5 text-slate-200 sm:mt-3 sm:text-base sm:leading-6">
            {description}
          </p>
          <div className="mt-4 border-l-2 border-brand-lime pl-3 sm:mt-6 sm:pl-4">
            <p className="text-xs font-medium italic leading-4 text-brand-lime-light sm:text-sm sm:leading-5">
              “{quote}”
            </p>
          </div>
        </div>

        {action ? (
          <Link
            href={action.href}
            className="mt-5 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-lime-light sm:mt-6 sm:min-h-11 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
          >
            {action.mobileLabel ? (
              <>
                <span className="sm:hidden">{action.mobileLabel}</span>
                <span className="hidden sm:inline">{action.label}</span>
              </>
            ) : (
              action.label
            )}
            {action.icon}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
