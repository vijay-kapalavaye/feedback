"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

type ThankYouModalProps = {
  open: boolean;
  onClose: () => void;
};

type Piece = {
  id: number;
  left: string;
  color: string;
  delay: number;
  duration: number;
  x: number;
  rotate: number;
};

function frac(n: number) {
  return n - Math.floor(n);
}

/** Deterministic 0–1 value from index (pure, stable across renders). */
function t01(i: number) {
  return frac(Math.sin(i * 12.9898) * 43758.5453123);
}

function buildPieces(count: number): Piece[] {
  const colors = [
    "#fde047",
    "#f472b6",
    "#a78bfa",
    "#38bdf8",
    "#fb923c",
    "#4ade80",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${t01(i * 3) * 100}%`,
    color: colors[i % colors.length]!,
    delay: t01(i * 5) * 0.35,
    duration: 1.8 + t01(i * 7) * 1.2,
    x: (t01(i * 11) - 0.5) * 120,
    rotate: (t01(i * 13) - 0.5) * 720,
  }));
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThankYouModal({ open, onClose }: ThankYouModalProps) {
  const isClient = useIsClient();
  const pieces = useMemo(() => buildPieces(48), []);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thank-you-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {pieces.map((p) => (
              <motion.span
                key={p.id}
                className="absolute top-0 h-2 w-2 rounded-sm"
                style={{ left: p.left, backgroundColor: p.color }}
                initial={{ y: "-10%", opacity: 1, rotate: 0, x: 0 }}
                animate={{
                  y: "110vh",
                  opacity: [1, 1, 0],
                  rotate: p.rotate,
                  x: p.x,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/25 bg-white/90 p-8 text-center shadow-2xl shadow-purple-900/30 backdrop-blur-xl dark:bg-slate-900/90"
            initial={{ scale: 0.85, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/40"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.12, stiffness: 400, damping: 18 }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 500, damping: 20 }}
              >
                <Check className="h-9 w-9" strokeWidth={3} aria-hidden />
              </motion.span>
            </motion.div>

            <h2
              id="thank-you-title"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              🎉 Thank You!
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              🙏 Thank you for providing your feedback. Your input helps us
              keep our workplace clean and comfortable.
            </p>

            <motion.p
              className="mt-4 text-3xl"
              aria-hidden
              animate={{ rotate: [0, 14, -10, 8, 0] }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              🎊
            </motion.p>

            <motion.button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/35 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              whileTap={{ scale: 0.97 }}
            >
              😊 Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
