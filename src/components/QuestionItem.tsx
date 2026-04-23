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
      className="rounded-lg border border-slate-200/90 bg-white/60 px-2 py-1.5 shadow-sm shadow-slate-200/50 sm:rounded-lg sm:px-2.5 sm:py-1.5 md:px-3 md:py-2"
      animate={
        showError
          ? { x: [0, -10, 10, -10, 10, -6, 6, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div
        id={`${question.id}-label`}
        className="mb-0.5 flex cursor-default items-start gap-1.5 text-xs font-medium text-slate-800 sm:mb-1 sm:gap-1.5 sm:text-sm"
      >
        <span className="text-sm sm:text-base" aria-hidden>
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
          className="mt-1 text-xs font-medium text-amber-700 sm:mt-1.5 sm:text-sm"
        >
          ⚠️ Please rate this question before submitting.
        </motion.p>
      )}
    </motion.div>
  );
}
