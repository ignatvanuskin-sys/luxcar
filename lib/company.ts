/**
 * Verified company data for Lux car (Семей).
 *
 * EVERYTHING in `VERIFIED` comes from the public 2GIS card of the company
 * (branch id 70000001065992611) and must not be changed without a new source.
 * Anything that is NOT confirmed by a source lives under `DEMO` and is always
 * rendered with a visible "Демо" marker so it can never be mistaken for a fact.
 *
 * Source: https://2gis.kz/semej/firm/70000001065992611
 * Snapshot taken: 2026-09-22
 */

export const TWO_GIS = {
  firmId: "70000001065992611",
  cardUrl: "https://2gis.kz/semej/firm/70000001065992611",
  reviewsUrl: "https://2gis.kz/semej/firm/70000001065992611/tab/reviews",
  /** Deep link that opens 2GIS directions to the entrance. */
  routeUrl:
    "https://2gis.kz/semej/directions/points/%7C80.219485%2C50.425137%3B70000001065992611",
} as const;

export const VERIFIED = {
  name: "Lux car",
  category: "Автосервис",
  priceCategory: "Легковой автосервис",
  city: "Семей",
  country: "Казахстан",
  /** 2GIS shows "Лодочный ж/м" as the micro-district. */
  district: "Лодочный ж/м",
  address: "ул. Новолодочная, 45в",
  addressFull: "Новолодочная улица, 45в, Семей",
  geo: { lat: 50.425137, lng: 80.219485 },
  phone: "+7 771 163 25 03",
  phoneHref: "tel:+77711632503",
  whatsapp: "https://wa.me/77711632503",
  /** "Ежедневно с 09:00 до 23:00" */
  hours: "Ежедневно с 09:00 до 23:00",
  hoursSchema: { opens: "09:00", closes: "23:00" },
  rating: 4.8,
  /** Ratings counter shown next to the rating on the card. */
  ratingsCount: 85,
  /** Written reviews counter (2GIS reviews tab). */
  reviewsCount: 42,
  photosCount: 5,
  payments: ["Наличный расчёт", "Перевод с карты"] as const,
  /** Service option listed on the card. */
  homeVisit: true,
  /** Car makes listed in the "Авторемонт" block of the card. */
  makes: ["Audi", "BMW", "Lexus", "Toyota"] as const,
  /** Nearest public transport stop as listed on the card. */
  nearestStop: { name: "Подгорная", walk: "5 мин", distance: "450 м" },
} as const;

/**
 * Rubric headings the company is listed under in the 2GIS directory.
 * These are the only service names that are actually confirmed by the source.
 */
export const VERIFIED_SERVICES = [
  "Компьютерная диагностика автомобилей",
  "Газовое оборудование для авто (ГБО)",
  "Замена масла",
  "Сварочные работы",
  "Автоэлектрик",
  "Ремонт и обслуживание легковых автомобилей",
  "Выезд на дом",
] as const;

/**
 * Market copy used for the demo concept. NONE of this is a verified claim about
 * Lux car — it is template positioning that the owner must confirm. Every place
 * that renders it is labelled as a demo.
 */
export const DEMO_NOTICE =
  "Демо-контент: маркетинговые формулировки, каталог направлений и время записи подготовлены как шаблон и требуют подтверждения владельцем.";

/**
 * Absolute site URL used for canonical links, Open Graph and the sitemap.
 *
 * Priority: explicit env var → the domain Vercel assigns to the project →
 * the current deployment URL → localhost. The Vercel fallbacks matter because
 * without them a deployment silently ships `http://localhost:3000` as its
 * canonical URL and link previews break.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  const vercelDeployment = process.env.VERCEL_URL;
  if (vercelDeployment) return `https://${vercelDeployment}`;

  return "http://localhost:3000";
}

export const SITE = {
  url: resolveSiteUrl(),
  title: "Lux Car — автосервис в Семее",
  description:
    "Автосервис Lux Car в Семее. Обслуживание и ремонт автомобилей. Запись на сервис онлайн.",
  ogImage: "/images/og-cover.jpg",
} as const;
