import * as React from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "flex w-full rounded-control border border-input bg-card text-foreground shadow-none transition-colors duration-150 placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputBase, "h-9 px-3 text-sm", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(inputBase, "min-h-24 px-3 py-2 text-sm leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/**
 * Field wrapper: label, optional hint, and an error slot wired for screen readers.
 * Every form in the product uses this so validation is announced consistently.
 */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-13 font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
        {!required && <span className="text-faint font-normal">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Search input with a leading icon — used in filter rails and in-table search. */
export const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }
>(({ className, icon, ...props }, ref) => (
  <div className="relative">
    <span
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
      aria-hidden="true"
    >
      {icon}
    </span>
    <input
      ref={ref}
      type="search"
      className={cn(inputBase, "h-9 pl-9 pr-3 text-sm", className)}
      {...props}
    />
  </div>
));
SearchInput.displayName = "SearchInput";
