"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AnimatedModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: "center" | "bottom";
  className?: string;
  labelledBy?: string;
}

const EXIT_MS = 300;

export function AnimatedModal({
  open,
  onClose,
  children,
  variant = "center",
  className = "",
  labelledBy,
}: AnimatedModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!mounted) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted, handleClose]);

  if (!mounted || typeof document === "undefined") return null;

  const isBottom = variant === "bottom";

  return createPortal(
    <div
      data-modal-root
      onClick={handleClose}
      className={`fixed inset-0 z-[200] flex ${
        isBottom ? "items-end justify-center sm:items-center" : "items-center justify-center p-4"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        aria-hidden="true"
        onClick={handleClose}
        className={`absolute inset-0 cursor-pointer bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        data-modal-panel
        onClick={(e) => e.stopPropagation()}
        className={`glass relative z-10 w-full shadow-2xl transition-all duration-300 ease-out ${
          isBottom
            ? `max-w-lg rounded-t-3xl border p-6 sm:rounded-3xl ${
                visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`
            : `max-w-lg rounded-3xl border p-6 ${
                visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`
        } ${className}`}
        style={{ borderColor: "rgb(var(--border))" }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
