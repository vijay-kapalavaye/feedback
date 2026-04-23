"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

type StarRatingProps = {
  id: string;
  label: string;
  /** Visible label element id for `aria-labelledby` */
  labelId: string;
  value: number;
  onChange: (value: number) => void;
  hasError?: boolean;
  sparkleOnSelect?: boolean;
};

function StarIcon({
  active,
  dimmed,
}: {
  active: boolean;
  dimmed: boolean;
}) {
  const gradId = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path
        fill={
          active
            ? `url(#${gradId})`
            : dimmed
              ? "#e2e8f0"
              : "#cbd5e1"
        }
        stroke={active ? "#b45309" : "#94a3b8"}
        strokeWidth="0.5"
        d="M12 2.5l2.8 6.4 6.9.6-5.2 4.5 1.6 6.8L12 17.9 7.9 20.8l1.6-6.8-5.2-4.5 6.9-.6L12 2.5z"
      />
    </svg>
  );
}

const SPARKLE_OFFSETS = [
  { x: -28, y: -18, r: -20 },
  { x: 26, y: -20, r: 15 },
  { x: -22, y: 22, r: -10 },
  { x: 24, y: 18, r: 25 },
  { x: 0, y: -32, r: 0 },
  { x: -34, y: 4, r: -35 },
  { x: 32, y: 6, r: 30 },
];

export function StarRating({
  id,
  label,
  labelId,
  value,
  onChange,
  hasError,
  sparkleOnSelect,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [bounceKey, setBounceKey] = useState(0);
  const [sparkleBurst, setSparkleBurst] = useState(0);
  const [kbdIndex, setKbdIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Value wins on click (kbd cleared); hover previews; keyboard uses kbdIndex while focused */
  const display = hover ?? kbdIndex ?? value;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 22 });
  const sy = useSpring(my, { stiffness: 280, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(circle at ${sx}px ${sy}px, rgba(251,191,36,0.45), transparent 58%)`;

  const handleSelect = useCallback(
    (n: number) => {
      setKbdIndex(null);
      setHover(null);
      onChange(n);
      setBounceKey((k) => k + 1);
      if (sparkleOnSelect) setSparkleBurst((k) => k + 1);
    },
    [onChange, sparkleOnSelect],
  );

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerMove={(e) => {
        if (!containerRef.current) return;
        const b = containerRef.current.getBoundingClientRect();
        mx.set(e.clientX - b.left);
        my.set(e.clientY - b.top);
      }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-1.5 rounded-xl opacity-0 transition-opacity duration-300 sm:-inset-3 sm:rounded-2xl"
        style={{
          background: glow,
          opacity: display > 0 ? 0.9 : 0,
        }}
      />

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-required="true"
        aria-orientation="horizontal"
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
        tabIndex={0}
        className="relative -mx-0.5 flex flex-wrap items-center gap-0 rounded-lg outline-none ring-offset-1 ring-offset-white/80 focus-visible:ring-2 focus-visible:ring-sky-400 sm:mx-0 sm:gap-1 sm:rounded-xl sm:ring-offset-2 md:gap-1.5"
        onKeyDown={(e) => {
          const curIndex = kbdIndex ?? (value || 1);
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            setKbdIndex(Math.min(5, curIndex + 1));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            setKbdIndex(Math.max(1, curIndex - 1));
          } else if (e.key >= "1" && e.key <= "5") {
            e.preventDefault();
            const n = Number(e.key);
            handleSelect(n);
          } else if (e.key === "Home") {
            e.preventDefault();
            setKbdIndex(1);
          } else if (e.key === "End") {
            e.preventDefault();
            setKbdIndex(5);
          } else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const n = kbdIndex ?? value;
            if (n && n >= 1 && n <= 5) handleSelect(n);
          }
        }}
        onFocus={() => setKbdIndex(value || 1)}
        onBlur={() => setKbdIndex(null)}
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= display;
          const dimmed = star > display;
          const isHoverTarget = hover === star;
          return (
            <motion.button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${label}: ${star} out of 5 stars`}
              tabIndex={-1}
              className="relative rounded-sm p-0 outline-none ring-sky-200/0 transition-[box-shadow,background-color] duration-200 hover:bg-sky-50/90 hover:shadow-[0_0_0_1px_rgba(186,230,253,0.95),0_8px_24px_rgba(14,165,233,0.12)] hover:ring-2 hover:ring-sky-200/80 sm:rounded-md sm:p-0.5 md:rounded-xl md:p-1"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              animate={
                bounceKey > 0 && star <= value
                  ? { scale: [1, 1.22, 0.96, 1.08, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 0.45,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              onMouseEnter={() => setHover(star)}
              onClick={() => handleSelect(star)}
            >
              <motion.span
                className="relative block rounded-lg"
                animate={
                  active
                    ? {
                        filter: isHoverTarget
                          ? [
                              "drop-shadow(0 0 0px rgba(251,191,36,0))",
                              "drop-shadow(0 0 14px rgba(251,191,36,0.75))",
                              "drop-shadow(0 0 8px rgba(251,191,36,0.45))",
                            ]
                          : [
                              "drop-shadow(0 0 0px rgba(251,191,36,0))",
                              "drop-shadow(0 0 10px rgba(251,191,36,0.55))",
                              "drop-shadow(0 0 5px rgba(251,191,36,0.35))",
                            ],
                      }
                    : {
                        filter: isHoverTarget
                          ? "drop-shadow(0 2px 8px rgba(14,165,233,0.2))"
                          : "drop-shadow(0 0 0px transparent)",
                      }
                }
                transition={{ duration: 0.45 }}
              >
                <StarIcon active={active} dimmed={dimmed} />
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {sparkleOnSelect && sparkleBurst > 0 && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {SPARKLE_OFFSETS.map((o, i) => (
            <motion.span
              key={`${sparkleBurst}-${i}`}
              className="absolute text-lg"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0.6],
                x: o.x,
                y: o.y,
                rotate: o.r,
              }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              ✨
            </motion.span>
          ))}
        </span>
      )}
    </div>
  );
}
