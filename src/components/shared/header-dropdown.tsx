"use client";

interface DropdownItem {
  title: string;
  description?: string;
  time?: string;
  onClick?: () => void;
}

interface HeaderDropdownProps {
  title: string;
  icon: React.ReactNode;
  items: DropdownItem[];
  emptyText: string;
  onClose: () => void;
}

export function HeaderDropdown({ title, icon, items, emptyText, onClose }: HeaderDropdownProps) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[calc(100vw-1.5rem)] max-w-[22rem] overflow-hidden rounded-2xl border border-border bg-surface shadow-popover sm:right-0">
      <div className="flex items-center justify-between border-b border-border bg-bg-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary-dark">
            {icon}
          </span>
          <p className="text-sm font-extrabold text-ink">{title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-body transition hover:bg-surface hover:text-ink"
          aria-label="Cerrar menú"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="max-h-[min(360px,calc(100vh-8rem))] overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="rounded-xl bg-bg-subtle p-4 text-sm text-body">{emptyText}</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  onClose();
                }}
                className="w-full rounded-xl border border-border bg-surface p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-ink">{item.title}</p>
                  {item.time && <span className="shrink-0 text-xs font-semibold text-muted">{item.time}</span>}
                </div>
                {item.description && <p className="mt-1 text-xs leading-5 text-body">{item.description}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}