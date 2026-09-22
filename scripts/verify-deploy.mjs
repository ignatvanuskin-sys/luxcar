/**
 * Checks a deployed instance of the site (Vercel or self-hosted).
 *
 *   node scripts/verify-deploy.mjs https://luxcar-pi.vercel.app
 *
 * Verifies: new build markers, canonical/OG domain, the bookings API round-trip
 * (including serverless persistence) and the admin page.
 */

const BASE = (process.argv[2] ?? "https://luxcar-pi.vercel.app").replace(/\/+$/, "");

let passed = 0;
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function text(path) {
  const response = await fetch(`${BASE}${path}`);
  return { status: response.status, body: (await response.text()).replace(/<!--.*?-->/g, "") };
}

async function main() {
  console.log(`\n== ${BASE} ==\n`);

  const home = await text("/");
  check("GET / → 200", home.status === 200, `status ${home.status}`);
  check("сборка свежая: параллакс hero", home.body.includes("parallax-hero"));
  check("сборка свежая: счётчики", home.body.includes("data-count-to"));
  check("сборка свежая: светящаяся рамка", home.body.includes("beam"));
  check("сборка свежая: орбы", home.body.includes("orb orb-"));

  const canonical = home.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const ogUrl = home.body.match(/property="og:url" content="([^"]+)"/)?.[1];
  const ogImage = home.body.match(/property="og:image" content="([^"]+)"/)?.[1];
  check(
    "canonical не localhost",
    Boolean(canonical) && !canonical.includes("localhost"),
    canonical,
  );
  check("og:url не localhost", Boolean(ogUrl) && !ogUrl.includes("localhost"), ogUrl);
  check(
    "og:image абсолютный",
    Boolean(ogImage) && ogImage.startsWith("https://") && !ogImage.includes("localhost"),
    ogImage,
  );

  const jsonLd = home.body.match(/"@type":"AutoRepair"/);
  check("JSON-LD AutoRepair", Boolean(jsonLd));

  const sitemap = await text("/sitemap.xml");
  check(
    "sitemap без localhost",
    sitemap.status === 200 && !sitemap.body.includes("localhost"),
  );

  const admin = await text("/admin");
  check("GET /admin → 200", admin.status === 200);
  check("/admin содержит панель", admin.body.includes("Панель заявок"));

  /* API round-trip: proves the storage layer works without a writable project
     directory (Vercel mounts the deployment read-only). */
  const listBefore = await fetch(`${BASE}/api/bookings`).then((r) => r.json());
  check("GET /api/bookings → 200 + массив", Array.isArray(listBefore.bookings));

  const draft = {
    serviceId: "diagnostics",
    serviceLabel: "Диагностика",
    carMake: "Проверка",
    carModel: "Деплоя",
    carYear: "2020",
    date: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    time: "12:00",
    name: "Тест деплоя (удалить)",
    phone: "+7 (700) 000-00-00",
    comment: "Автопроверка api после деплоя",
  };

  const created = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  const createdBody = await created.json().catch(() => ({}));
  check("POST /api/bookings → 201", created.status === 201, `status ${created.status}`);
  check("заявка получила id", typeof createdBody.id === "string");

  const listAfter = await fetch(`${BASE}/api/bookings`).then((r) => r.json());
  check(
    "заявка читается обратно (хранилище работает)",
    listAfter.bookings?.some((booking) => booking.id === createdBody.id),
  );

  const patched = await fetch(
    `${BASE}/api/bookings?id=${encodeURIComponent(createdBody.id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    },
  ).then((response) => response.json());
  check("PATCH статуса работает", patched.status === "confirmed");

  console.log(`\nИтого: ${passed} успешно, ${failed} с ошибками\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("Проверка деплоя упала:", error);
  process.exit(1);
});
