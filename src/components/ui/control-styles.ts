export const CONTROL_CLASS =
  "min-h-11 w-full min-w-0 max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary-light/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";

export function controlClassName(invalid = false, className = "") {
  const stateClass = invalid
    ? "border-danger bg-danger-light focus:border-danger focus:ring-danger/20 dark:bg-red-500/10"
    : "";

  return `${CONTROL_CLASS} ${stateClass} ${className}`;
}
