/**
 * Unit check for the phone mask (bug found during visual QA and fixed).
 *
 * The editable value holds only the national part ("700 123-45-67"); the "+7"
 * country code is rendered as a static prefix, so keystrokes cannot corrupt the
 * digits. Full pasted numbers are normalised.
 *
 * Run: node --experimental-strip-types scripts/phone-mask.test.mjs
 */

import {
  formatPhoneInput,
  isPhoneComplete,
  toInternationalPhone,
} from "../lib/utils.ts";

const nationalCases = [
  ["7001234567", "700 123-45-67"],
  ["77001234567", "700 123-45-67"],
  ["87001234567", "700 123-45-67"],
  ["+7 (771) 163-25-03", "771 163-25-03"],
  ["7711632503", "771 163-25-03"],
  ["700", "700"],
  ["7001234", "700 123-4"],
  ["", ""],
];

const internationalCases = [
  ["700 123-45-67", "+7 (700) 123-45-67"],
  ["7711632503", "+7 (771) 163-25-03"],
  ["", ""],
];

let failed = 0;

function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label} → "${actual}"${ok ? "" : ` (ожидалось "${expected}")`}`,
  );
}

for (const [input, expected] of nationalCases) {
  check(`национальный "${input}"`, formatPhoneInput(input), expected);
}

for (const [input, expected] of internationalCases) {
  check(`международный "${input}"`, toInternationalPhone(input), expected);
}

// Progressive typing must be stable (no prefix accumulation, no digit loss).
let typed = "";
for (const char of "7001234567") {
  typed = formatPhoneInput(typed + char);
}
check("посимвольный ввод", typed, "700 123-45-67");
check("номер распознан как полный", String(isPhoneComplete(typed)), "true");

// Deleting characters must also stay clean.
let shrinking = typed;
for (let i = 0; i < 4; i += 1) {
  shrinking = formatPhoneInput(shrinking.slice(0, -1));
}
check("обратное удаление", shrinking, "700 123");

console.log(`\n${failed === 0 ? "Все проверки маски пройдены" : `Ошибок: ${failed}`}`);
process.exit(failed === 0 ? 0 : 1);
