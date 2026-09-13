interface MobileDataRow {
  label: string;
  value: React.ReactNode;
}

interface MobileDataCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rows: MobileDataRow[];
  actions?: React.ReactNode;
}

export function MobileDataList({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-3 md:hidden print:hidden">{children}</ul>;
}

export function MobileDataCard({
  title,
  subtitle,
  rows,
  actions,
}: MobileDataCardProps) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="min-w-0">
        <p className="font-bold text-slate-900 dark:text-white">{title}</p>
        {subtitle && (
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        )}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {row.label}
            </dt>
            <dd className="mt-1 break-words text-slate-700 dark:text-slate-300">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {actions && (
        <div className="mt-4 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          {actions}
        </div>
      )}
    </li>
  );
}
