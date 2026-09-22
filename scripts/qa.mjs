/**
 * End-to-end smoke test for the demo site.
 *
 * Usage:  node scripts/qa.mjs [baseUrl]
 * Requires a running server (npm run dev or npm start).
 * Not part of the app runtime.
 */

const BASE = process.argv[2] ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function getText(path) {
  const response = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const raw = await response.text();
  // React splits interpolated text with comment markers ("Шаг <!-- -->1"),
  // so strip them before matching visible copy.
  return { response, text: raw.replace(/<!--.*?-->/g, "") };
}

async function main() {
  console.log(`\n== Страницы ==`);

  const home = await getText("/");
  check("GET / → 200", home.response.status === 200, `status ${home.response.status}`);
  check("H1 присутствует", /<h1[^>]*>/.test(home.text));
  check("Заголовок страницы (SEO)", home.text.includes("Lux Car — автосервис в Семее"));
  check("Meta description", home.text.includes("Автосервис Lux Car в Семее"));
  check("Open Graph теги", home.text.includes('property="og:image"'));
  check("JSON-LD LocalBusiness/AutoRepair", home.text.includes('"@type":"AutoRepair"'));
  check("Телефон из 2ГИС на странице", home.text.includes("+7 771 163 25 03"));
  check("Адрес на странице", home.text.includes("Новолодочная"));
  check("Рейтинг 4.8 из 2ГИС", home.text.includes("4.8"));
  check("Блок отзывов: реальный текст из 2ГИС", home.text.includes("редуктор"));
  check("Карта (iframe OSM)", home.text.includes("openstreetmap.org/export/embed.html"));
  check("Ссылка на маршрут в 2ГИС", home.text.includes("2gis.kz/semej/directions"));
  check("Секции якорями", ["services", "about", "advantages", "process", "gallery", "reviews", "contacts"].every((id) => home.text.includes(`id="${id}"`)));
  check("Нет выдуманных цен (нет ₸/тенге)", !/\d[\d\s]{2,}\s?(₸|тенге)/i.test(home.text));

  const bookingPage = await getText("/booking");
  check("GET /booking → 200", bookingPage.response.status === 200);
  check("/booking: шаг 1 формы", bookingPage.text.includes("Шаг 1 из 5"));

  const admin = await getText("/admin");
  check("GET /admin → 200", admin.response.status === 200);
  check("/admin: панель заявок", admin.text.includes("Панель заявок"));
  check("/admin: noindex", admin.text.includes("noindex"));

  const robots = await getText("/robots.txt");
  check("robots.txt отдаётся", robots.response.status === 200);
  check("robots.txt закрывает /admin", robots.text.includes("/admin"));

  const sitemap = await getText("/sitemap.xml");
  check("sitemap.xml отдаётся", sitemap.response.status === 200);

  const icon = await fetch(`${BASE}/icon.svg`);
  check("icon.svg отдаётся", icon.status === 200);

  const og = await fetch(`${BASE}/images/og-cover.jpg`);
  check("OG-изображение отдаётся", og.status === 200);

  console.log(`\n== API заявок ==`);

  const draft = {
    serviceId: "diagnostics",
    serviceLabel: "Диагностика",
    carMake: "Toyota",
    carModel: "Camry",
    carYear: "2019",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "11:00",
    name: "QA Проверка",
    phone: "+7 (700) 111-22-33",
    comment: "Автотест",
  };

  const created = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  const createdBody = await created.json().catch(() => ({}));
  check("POST /api/bookings → 201", created.status === 201, `status ${created.status}`);
  check("Заявка получила id", typeof createdBody.id === "string" && createdBody.id.length > 3);
  check("Статус новой заявки = new", createdBody.status === "new");

  const invalid = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Без обязательных полей" }),
  });
  check("Валидация: пустая заявка отклонена (400)", invalid.status === 400);

  const list = await fetch(`${BASE}/api/bookings`).then((response) => response.json());
  check(
    "GET /api/bookings возвращает созданную заявку",
    Array.isArray(list.bookings) && list.bookings.some((item) => item.id === createdBody.id),
  );

  const patched = await fetch(
    `${BASE}/api/bookings?id=${encodeURIComponent(createdBody.id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    },
  ).then((response) => response.json());
  check("PATCH меняет статус на confirmed", patched.status === "confirmed");

  const badStatus = await fetch(
    `${BASE}/api/bookings?id=${encodeURIComponent(createdBody.id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "неверный" }),
    },
  );
  check("PATCH с неизвестным статусом → 400", badStatus.status === 400);

  console.log(`\nИтого: ${passed} успешно, ${failed} с ошибками\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("QA упал:", error);
  process.exit(1);
});
