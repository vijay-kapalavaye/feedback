"use client";

import { motion } from "framer-motion";
import { StarRating } from "./StarRating";

export type QuestionDef = {
  id: string;
  emoji: string;
  text: string;
  sparkleOnSelect?: boolean;
};

type QuestionItemProps = {
  question: QuestionDef;
  value: number;
  onChange: (value: number) => void;
  showError: boolean;
};

export function QuestionItem({
  question,
  value,
  onChange,
  showError,
}: QuestionItemProps) {
  return (
    <motion.div
      layout
      className="rounded-xl border border-slate-200/90 bg-white/60 px-3 py-3 shadow-sm shadow-slate-200/50 sm:px-4 sm:py-4"
      animate={
        showError
          ? { x: [0, -10, 10, -10, 10, -6, 6, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div
        id={`${question.id}-label`}
        className="mb-2 flex cursor-default items-start gap-2 text-sm font-medium text-slate-800 sm:text-base"
      >
        <span className="text-lg sm:text-xl" aria-hidden>
          {question.emoji}
        </span>
        <span>{question.text}</span>
      </div>

      <StarRating
        id={question.id}
        label={`${question.emoji} ${question.text}`}
        labelId={`${question.id}-label`}
        value={value}
        onChange={onChange}
        hasError={showError}
        sparkleOnSelect={question.sparkleOnSelect}
      />

      {showError && (
        <motion.p
          id={`${question.id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-medium text-amber-700"
        >
          ⚠️ Please rate this question before submitting.
        </motion.p>
      )}
    </motion.div>
  );
}
