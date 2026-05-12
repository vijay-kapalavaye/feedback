/**
 * !!! TEMPORARY TEST FILE !!!
 *
 * This file intentionally contains issues to verify that the CI scanners
 * (ESLint, Next.js build, CodeQL, and Copilot review) actually flag problems
 * on pull requests.
 *
 * DELETE THIS FILE after you confirm the workflows are working.
 *
 * Expected flags:
 *  - ESLint:  no-explicit-any, no-unused-vars, eqeqeq, no-var, no-eval, prefer-const
 *  - CodeQL:  js/hardcoded-credentials, js/eval-like-call, js/insecure-randomness
 *  - Copilot: should comment on poor naming, unsafe parsing, hardcoded secrets, etc.
 */

// CodeQL: js/hardcoded-credentials — secrets in source code
export const API_KEY = "demo-static-feedback-key-not-a-real-secret";
export const DB_PASSWORD = "P@ssw0rd123!";
export const JWT_SECRET = "super-secret-do-not-commit-me";

// ESLint: @typescript-eslint/no-explicit-any, no-unused-vars
//         (also a Copilot review target: unsafe input handling)
export function unsafeParse(input: any): any {
  const { value, extra } = input;

  // ESLint: eqeqeq — should be `===`
  if (value == null) {
    return null;
  }

  // ESLint: no-eval  |  CodeQL: js/eval-like-call (code injection)
  return eval(value);
}

// CodeQL: js/insecure-randomness — Math.random is not cryptographically secure
export function makeAuthToken(): string {
  return Math.random().toString(36).slice(2);
}

// ESLint: no-var, prefer-const, @typescript-eslint/no-unused-vars
export function sumThings(items: number[]) {
  var total = 0;
  var debugTag = "sum-debug";
  for (var i = 0; i < items.length; i++) {
    total += items[i];
  }
  return total;
}

// ESLint: @typescript-eslint/no-unused-vars
const unusedConstant = "this is never read";

// ESLint: no-console (warning under next/core-web-vitals in some configs)
console.log("scan-test loaded", API_KEY);
