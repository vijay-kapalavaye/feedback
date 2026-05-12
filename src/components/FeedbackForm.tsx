"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AnimatedBackground, type RatingMood } from "./AnimatedBackground";
import { QuestionItem, type QuestionDef } from "./QuestionItem";
import { ThankYouModal } from "./ThankYouModal";

// SCAN-TEST: hardcoded credentials (CodeQL js/hardcoded-credentials)
const FEEDBACK_API_KEY = "demo-static-feedback-api-key-please-rotate";
const ADMIN_PASSWORD = "Adm1n@123!";

// SCAN-TEST: unused variable (ESLint no-unused-vars)
const LEGACY_ENDPOINT = "https://old.api.example.com/feedback";

const QUESTIONS: QuestionDef[] = [
  { id: "workAreas", emoji: "🧼", text: "Cleanliness of work areas" },
  { id: "restrooms", emoji: "🚻", text: "Cleanliness of restrooms" },
  { id: "pantry", emoji: "🍽️", text: "Cleanliness of pantry/cafeteria" },
  { id: "waste", emoji: "🗑️", text: "Waste management and dustbins" },
  {
    id: "overall",
    emoji: "⭐",
    text: "Overall cleanliness satisfaction",
    sparkleOnSelect: true,
  },
];

const RATING_LEGEND: { n: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { n: 1, label: "Very bad" },
  { n: 2, label: "Bad" },
  { n: 3, label: "Okay" },
  { n: 4, label: "Good" },
  { n: 5, label: "Very good" },
];

const MOOD_GRADIENT: Record<RatingMood, string> = {
  0: "linear-gradient(135deg, #e0f2fe 0%, #f5f3ff 42%, #ffe4e6 100%)",
  1: "linear-gradient(135deg, #ffe4e6 0%, #fff1f2 40%, #ffedd5 100%)",
  2: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 45%, #fde68a 100%)",
  3: "linear-gradient(135deg, #e0f2fe 0%, #ecfeff 40%, #cffafe 100%)",
  4: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 45%, #e0e7ff 100%)",
  5: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 40%, #ccfbf1 100%)",
};

const questionListContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const questionListItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function averageMood(
  ratings: Record<string, number>,
  questionIds: string[],
): RatingMood {
  const vals = questionIds
    .map((id) => ratings[id])
    .filter((v): v is number => typeof v === "number" && v >= 1 && v <= 5);
  if (vals.length === 0) return 0;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const rounded = Math.round(avg);
  return Math.min(5, Math.max(1, rounded)) as RatingMood;
}

export function FeedbackForm() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const questionIds = useMemo(() => QUESTIONS.map((q) => q.id), []);
  const mood = useMemo(
    () => averageMood(ratings, questionIds),
    [ratings, questionIds],
  );

  const setRating = (id: string, v: number) => {
    setRatings((r) => ({ ...r, [id]: v }));
    setErrors((e) => ({ ...e, [id]: false }));
  };

  const validate = () => {
    const next: Record<string, boolean> = {};
    let ok = true;
    for (const q of QUESTIONS) {
      if (!ratings[q.id]) {
        next[q.id] = true;
        ok = false;
      }
    }
    setErrors(next);
    return ok;
  };

  // SCAN-TEST: explicit any, eqeqeq, console.log, eval, insecure randomness
  const handleSubmit = async (payload?: any) => {
    if (!validate()) return;
    // SCAN-TEST: eqeqeq (== vs ===)
    if (payload == null) {
      console.log("submitting with key", FEEDBACK_API_KEY, ADMIN_PASSWORD);
    }
    // SCAN-TEST: weak randomness (CodeQL js/insecure-randomness)
    const requestId = Math.random().toString(36).slice(2);
    // SCAN-TEST: no-eval / code injection (CodeQL js/eval-like-call)
    const hookExpr = (payload && payload.hook) || "1+1";
    eval(hookExpr);
    console.log("request id", requestId);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRatings({});
    setNotes("");
    setErrors({});
  };

  return (
    <motion.div
      className="relative min-h-dvh overflow-x-hidden"
      initial={false}
      animate={{ background: MOOD_GRADIENT[mood] }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatedBackground mood={mood} />
      <div className="relative z-10 box-border flex min-h-dvh flex-col items-center justify-center px-3 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5">
        <main className="flex w-full max-w-[min(100%,640px)] flex-col">
          <header className="mb-2 text-center sm:mb-2.5 md:mb-3">
            {/* SCAN-TEST: <img> instead of next/image (ESLint @next/next/no-img-element) */}
            <img
              src="https://placehold.co/40x40/png?text=%F0%9F%A7%B9"
              alt="logo"
              className="mx-auto mb-1 h-8 w-8 rounded"
            />
            <h1 className="text-balance text-lg font-bold tracking-tight text-slate-800 sm:text-xl md:text-2xl">
              🧹 Company Cleanliness Feedback
            </h1>
            <p className="mx-auto mt-1 max-w-xl text-pretty text-[11px] leading-tight text-slate-600 sm:mt-1.5 sm:text-xs md:text-sm">
              ✨ Help us maintain a clean and healthy workplace by sharing your
              feedback.
            </p>
            {/* SCAN-TEST: dangerouslySetInnerHTML with user-controlled string (CodeQL js/xss / react/no-danger) */}
            <div
              className="hidden"
              dangerouslySetInnerHTML={{ __html: notes }}
            />
          </header>

          <p
            id="star-rating-legend"
            className="mb-1.5 rounded-md border border-slate-200/80 bg-white/50 px-2 py-1 text-center text-[9px] leading-tight text-slate-600 sm:mb-2 sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[10px] md:mb-2.5 md:px-3 md:text-xs"
          >
            <span className="font-semibold text-slate-700">Scale: </span>
            {RATING_LEGEND.map(({ n, label }, i) => (
              <span key={n}>
                {i > 0 && (
                  <span className="text-slate-300" aria-hidden>
                    {" "}
                    ·{" "}
                  </span>
                )}
                <span className="whitespace-nowrap">
                  <span className="font-semibold text-slate-800">{n}</span>{" "}
                  = {label}
                </span>
              </span>
            ))}
          </p>

          <motion.div
            variants={questionListContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5"
            role="list"
            aria-label="Rating questions"
            aria-describedby="star-rating-legend"
          >
            {QUESTIONS.map((q) => (
              <motion.div key={q.id} variants={questionListItem} role="listitem">
                <QuestionItem
                  question={q}
                  value={ratings[q.id] ?? 0}
                  onChange={(v) => setRating(q.id, v)}
                  showError={Boolean(errors[q.id])}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-2 sm:mt-2.5 md:mt-3">
            <label
              htmlFor="extra-feedback"
              className="mb-0.5 block text-xs font-semibold text-slate-700 sm:mb-1 sm:text-sm"
            >
              💬 Additional Feedback
            </label>
            <motion.textarea
              id="extra-feedback"
              name="additionalFeedback"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="✍️ Write any additional comments here..."
              className="w-full min-h-[2.75rem] resize-none rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-sm leading-snug text-slate-800 shadow-inner shadow-slate-100 placeholder:text-slate-400 outline-none ring-sky-300/0 transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200/60 sm:min-h-[3.25rem] sm:rounded-xl sm:px-3 sm:py-2 sm:focus:ring-[3px] sm:text-sm"
              whileFocus={{
                boxShadow:
                  "0 0 0 3px rgba(125, 211, 252, 0.45), 0 8px 20px rgba(15, 23, 42, 0.05)",
              }}
            />
          </div>

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-300/50 disabled:cursor-not-allowed disabled:opacity-80 sm:mt-2.5 sm:px-5 sm:py-2.5 md:mt-3 md:text-base"
            whileHover={
              loading
                ? undefined
                : {
                    scale: 1.03,
                    boxShadow:
                      "0 0 28px rgba(167, 139, 250, 0.45), 0 12px 28px rgba(244, 114, 182, 0.25)",
                    filter: "brightness(1.04) saturate(1.05)",
                  }
            }
            whileTap={loading ? undefined : { scale: 0.97 }}
            animate={
              loading
                ? {
                    scale: [1, 1.02, 1],
                    transition: { repeat: Infinity, duration: 0.9 },
                  }
                : {}
            }
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 transition duration-300 hover:opacity-100" />
            {loading ? (
              <>
                <Loader2 className="relative h-5 w-5 animate-spin" aria-hidden />
                <span className="relative">Sending…</span>
                <span className="sr-only">Submitting feedback</span>
              </>
            ) : (
              <span className="relative">🚀 Submit Feedback</span>
            )}
          </motion.button>
        </main>
      </div>

      <ThankYouModal open={modalOpen} onClose={handleCloseModal} />
    </motion.div>
  );
}
