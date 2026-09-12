"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TOAST — 4s auto-dismiss, per the design system. Announced politely so it does
   not interrupt a screen reader mid-sentence.
   ========================================================================= */

type ToastTone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; tone?: ToastTone }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const TONE_META: Record<ToastTone, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle2 className="size-4 text-success" aria-hidden="true" />,
    className: "border-success-border",
  },
  error: {
    icon: <XCircle className="size-4 text-destructive" aria-hidden="true" />,
    className: "border-destructive-border",
  },
  info: {
    icon: <Info className="size-4 text-primary" aria-hidden="true" />,
    className: "border-border",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const counter = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ title, description, tone = "info" }) => {
      const id = ++counter.current;
      setItems((prev) => [...prev, { id, title, description, tone }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-card border bg-card p-3 shadow-overlay",
              TONE_META[item.tone].className,
            )}
          >
            <span className="mt-0.5">{TONE_META[item.tone].icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-13 font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="-mr-1 -mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    // Fail loudly in development, degrade quietly in production rather than crash a page.
    if (process.env.NODE_ENV !== "production") {
      throw new Error("useToast must be used within <ToastProvider>");
    }
    return { toast: () => undefined };
  }
  return ctx;
}

/* ==========================================================================
   ALERT — inline, non-transient messaging
   ========================================================================= */

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warning" | "success" | "error";
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const map = {
    info: { cls: "border-border bg-subtle", icon: <Info className="size-4 text-primary" /> },
    warning: {
      cls: "border-warning-border bg-warning-subtle",
      icon: <AlertTriangle className="size-4 text-warning" />,
    },
    success: {
      cls: "border-success-border bg-success-subtle",
      icon: <CheckCircle2 className="size-4 text-success" />,
    },
    error: {
      cls: "border-destructive-border bg-destructive-subtle",
      icon: <XCircle className="size-4 text-destructive" />,
    },
  }[tone];

  return (
    <div className={cn("flex items-start gap-2.5 rounded-card border p-3", map.cls, className)}>
      <span className="mt-0.5 shrink-0">{map.icon}</span>
      <div className="min-w-0 flex-1 text-13 leading-relaxed">
        {title && <p className="font-medium text-foreground">{title}</p>}
        {children && <div className={cn("text-muted-foreground", title && "mt-0.5")}>{children}</div>}
      </div>
    </div>
  );
}
