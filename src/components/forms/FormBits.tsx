"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CircleCheck, Info, Loader2 } from "lucide-react";
import type { FormState } from "@/lib/validation";
import { cn } from "@/lib/utils";

export const PendingContext = createContext<boolean | null>(null);
export const FormStateContext = createContext<FormState | null>(null);

/** Message d'erreur d'un champ, lu depuis l'état du formulaire parent. */
export function ErrorFor({ name }: { name: string }) {
  const msg = useContext(FormStateContext)?.errors?.[name];
  return msg ? <p className="field-error">{msg}</p> : null;
}

/**
 * Soumission d'une action serveur SANS réinitialisation automatique du formulaire
 * (React 19 vide les champs après une action : gênant en cas d'erreur de saisie).
 */
export function useFormAction<S extends object>(action: (prev: S, form: FormData) => Promise<S>, initial: S) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial as Awaited<S>);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const fd = new FormData(e.currentTarget, submitter ?? undefined);
    startTransition(() => dispatch(fd));
  };
  return { state, pending, onSubmit };
}

export function usePending() {
  const ctx = useContext(PendingContext);
  const { pending } = useFormStatus();
  return ctx ?? pending;
}

/** Champ piège invisible + horodatage : filtre une grande partie des robots sans gêner les visiteurs. */
export function SpamGuard() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);
  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={ref} type="hidden" name="_t" defaultValue="0" />
    </>
  );
}

export function SubmitButton({ children, className, pendingLabel = "Envoi en cours…" }: { children: React.ReactNode; className?: string; pendingLabel?: string }) {
  const pending = usePending();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={cn("btn btn-primary", className)}>
      {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  const tone = state.demo ? "demo" : state.ok ? "ok" : "error";
  const Icon = tone === "ok" ? CircleCheck : tone === "demo" ? Info : AlertTriangle;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "anim-modal flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm",
        tone === "ok" && "border-success/30 bg-success/10 text-success",
        tone === "demo" && "border-wood/30 bg-wood/10 text-charcoal",
        tone === "error" && "border-danger/30 bg-danger/10 text-danger",
      )}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden />
      <p>{state.message}</p>
    </div>
  );
}

export function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const ctxError = useContext(FormStateContext)?.errors?.[name];
  error = error ?? ctxError;
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label} {required && <span className="text-wood" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}
