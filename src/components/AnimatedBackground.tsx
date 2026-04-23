"use client";

import { motion } from "framer-motion";

const FLOATING_EMOJIS = ["⭐", "✨", "🧼", "🧹", "🧽"] as const;

/** 0 = no ratings yet; 1–5 = rounded average band for orb / page tint */
export type RatingMood = 0 | 1 | 2 | 3 | 4 | 5;

const moodOrbs: Record<
  RatingMood,
  { className: string; delay: number }[]
> = {
  0: [
    { className: "left-[5%] top-[12%] h-72 w-72 bg-sky-200/50", delay: 0 },
    { className: "right-[8%] top-[20%] h-96 w-96 bg-violet-200/45", delay: 1.2 },
    { className: "left-[20%] bottom-[5%] h-80 w-80 bg-rose-200/40", delay: 0.6 },
    { className: "right-[25%] bottom-[15%] h-64 w-64 bg-amber-100/50", delay: 1.8 },
  ],
  1: [
    { className: "left-[8%] top-[15%] h-80 w-80 bg-rose-200/55", delay: 0 },
    { className: "right-[5%] bottom-[10%] h-72 w-72 bg-orange-100/50", delay: 1 },
  ],
  2: [
    { className: "right-[10%] top-[12%] h-96 w-96 bg-amber-200/50", delay: 0.2 },
    { className: "left-[12%] bottom-[8%] h-72 w-72 bg-yellow-100/55", delay: 1.1 },
  ],
  3: [
    { className: "left-[6%] top-[18%] h-80 w-80 bg-sky-200/50", delay: 0 },
    { className: "right-[18%] bottom-[12%] h-80 w-80 bg-cyan-100/50", delay: 0.9 },
  ],
  4: [
    { className: "right-[6%] top-[14%] h-96 w-96 bg-violet-200/50", delay: 0.3 },
    { className: "left-[15%] bottom-[10%] h-72 w-72 bg-indigo-100/55", delay: 1.2 },
  ],
  5: [
    { className: "left-[10%] top-[10%] h-96 w-96 bg-emerald-200/50", delay: 0 },
    { className: "right-[12%] bottom-[8%] h-80 w-80 bg-teal-100/55", delay: 0.8 },
    { className: "left-[30%] bottom-[20%] h-64 w-64 bg-lime-100/45", delay: 1.5 },
  ],
};

type AnimatedBackgroundProps = {
  mood: RatingMood;
};

export function AnimatedBackground({ mood }: AnimatedBackgroundProps) {
  const orbs = moodOrbs[mood];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={`${mood}-${i}`}
          layout
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          initial={{ opacity: 0.35, scale: 0.92 }}
          animate={{
            opacity: [0.32, 0.52, 0.32],
            scale: [0.96, 1.06, 0.96],
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {FLOATING_EMOJIS.map((emoji, i) => (
        <motion.span
          key={emoji + i}
          className="absolute select-none text-2xl opacity-[0.28] drop-shadow-sm sm:text-3xl md:text-4xl"
          style={{
            left: `${12 + i * 18}%`,
            top: `${18 + (i % 3) * 22}%`,
          }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [-8, 12, -8],
            rotate: [-5, 5, -5],
            opacity: [0.2, 0.38, 0.2],
          }}
          transition={{
            duration: 9 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {emoji}
        </motion.span>
      ))}

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-light"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#64748b"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-light)" />
      </svg>
    </div>
  );
}
