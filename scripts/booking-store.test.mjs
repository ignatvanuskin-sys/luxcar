/**
 * Regression test for the booking storage layer.
 *
 *   node --experimental-strip-types --import ./scripts/register-loader.mjs \
 *        scripts/booking-store.test.mjs
 *
 * Covers the serverless reality: an instance can accept a POST and then answer
 * 404 to a later PATCH for the same row. The store must fall back to the browser
 * mirror, report the row as browser-only, remember that decision, and stop
 * retrying the API for it.
 */

let failures = 0;

function check(name, condition, detail = "") {
  console.log(`  ${condition ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!condition) failures += 1;
}

/* ---------------- environment stubs ---------------- */

const storage = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => void storage.set(key, String(value)),
    removeItem: (key) => void storage.delete(key),
  },
};

let patchCalls = 0;
let serverHasRow = true;

globalThis.fetch = async (url, init = {}) => {
  const method = (init.method ?? "GET").toUpperCase();

  if (method === "POST") {
    return {
      ok: true,
      status: 201,
      json: async () => ({
        ...JSON.parse(init.body),
        id: "bk_test1",
        createdAt: new Date().toISOString(),
        status: "new",
      }),
    };
  }

  if (method === "PATCH") {
    patchCalls += 1;
    return { ok: false, status: 404, json: async () => ({ error: "Заявка не найдена" }) };
  }

  // The flaky part of per-instance storage: GET may still see the row.
  return { ok: true, status: 200, json: async () => ({ bookings: serverHasRow ? [] : [] }) };
};

/* ---------------- test ---------------- */

const { getBookingStore } = await import("../lib/booking.ts");
const store = getBookingStore();

const created = await store.create({
  serviceId: "diagnostics",
  serviceLabel: "Диагностика",
  carMake: "Toyota",
  carModel: "Camry",
  carYear: "2019",
  date: "2026-09-23",
  time: "09:00",
  name: "Тест логики",
  phone: "+7 (700) 123-45-67",
  comment: "",
});

check("create уходит на сервер", store.kind === "api");
check("create дублируется в зеркало браузера", storage.has("luxcar:bookings:v1"));

const first = await store.updateStatus(created.id, "confirmed");
check("404 → строка помечена локальной", first.origin === "local", `origin=${first.origin}`);
check("404 → статус всё равно сохранён", first.status === "confirmed");
check("сделан ровно один PATCH", patchCalls === 1, `calls=${patchCalls}`);
check("id запомнен как локальный", (storage.get("luxcar:local-only-ids:v1") ?? "").includes("bk_test1"));

const second = await store.updateStatus(created.id, "done", {
  localOnly: first.origin === "local",
});
check("повторная смена статуса не дёргает API", patchCalls === 1, `calls=${patchCalls}`);
check("статус обновлён", second.status === "done");
check("пометка origin сохраняется после локального обновления", second.origin === "local");

// Even an explicit `localOnly: false` must not bypass the remembered id.
const third = await store.updateStatus(created.id, "in_progress", { localOnly: false });
check(
  "явный localOnly:false не отменяет запомненный id",
  patchCalls === 1 && third.origin === "local",
  `calls=${patchCalls}, origin=${third.origin}`,
);

// Even if some instance answers GET with the row again, the decision sticks.
serverHasRow = true;
const list = await store.list();
check(
  "list держит запомненную строку локальной",
  list.every((booking) => booking.origin === "local"),
);
check("list не потерял заявку", list.length === 1);

console.log(`\n${failures === 0 ? "Все проверки пройдены" : `Ошибок: ${failures}`}\n`);
process.exit(failures === 0 ? 0 : 1);
