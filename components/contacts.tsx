import {
  Banknote,
  Car,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  TrainFront,
} from "lucide-react";

import { BookButton } from "@/components/book-button";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { TWO_GIS, VERIFIED } from "@/lib/company";

export function Contacts() {
  const rows = [
    {
      icon: MapPin,
      label: "Адрес",
      value: `${VERIFIED.address}, ${VERIFIED.city}`,
      hint: `${VERIFIED.district} · остановка «${VERIFIED.nearestStop.name}» — ${VERIFIED.nearestStop.walk}, ${VERIFIED.nearestStop.distance}`,
    },
    {
      icon: Clock,
      label: "Часы работы",
      value: VERIFIED.hours,
      hint: "Данные карточки 2ГИС. Фактическое время приёма подтверждает администратор.",
    },
    {
      icon: Car,
      label: "Марки",
      value: VERIFIED.makes.join(" · "),
      hint: "Указаны в блоке «Авторемонт» карточки 2ГИС.",
    },
    {
      icon: Banknote,
      label: "Оплата",
      value: VERIFIED.payments.join(" · "),
      hint: "Итоговую стоимость согласовываем до начала работ.",
    },
    {
      icon: TrainFront,
      label: "Транспорт",
      value: `Остановка «${VERIFIED.nearestStop.name}»`,
      hint: `${VERIFIED.nearestStop.walk} пешком · ${VERIFIED.nearestStop.distance}`,
    },
  ];

  return (
    <section
      id="contacts"
      className="scroll-mt-28 border-t border-white/[0.06] bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Контакты"
          title="Приезжайте на Новолодочную, 45в"
          description="Телефон, WhatsApp и адрес — из карточки компании в 2ГИС. Ниже карта и маршрут в один клик."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div data-reveal className="panel rounded-3xl p-6 lg:p-8">
            <p className="font-display text-xl font-bold tracking-[0.14em] text-white">
              LUX<span className="text-accent-500">CAR</span>
            </p>
            <p className="mt-1 text-[13px] text-white/45">
              {VERIFIED.category} · {VERIFIED.city}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={VERIFIED.phoneHref} size="lg" className="justify-center">
                <Phone aria-hidden className="size-5" />
                {VERIFIED.phone}
              </ButtonLink>
              <ButtonLink
                href={VERIFIED.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                variant="secondary"
                size="lg"
                className="justify-center"
              >
                <MessageCircle aria-hidden className="size-5 text-accent-400" />
                WhatsApp
              </ButtonLink>
            </div>

            <dl className="mt-8 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {rows.map(({ icon: Icon, label, value, hint }) => (
                <div key={label} className="flex gap-4 py-4">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Icon aria-hidden className="size-4 text-accent-400" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[11px] tracking-[0.14em] text-white/40 uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-white">{value}</dd>
                    <dd className="mt-1 text-[12px] leading-relaxed text-white/40">
                      {hint}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={TWO_GIS.routeUrl}
                target="_blank"
                rel="noreferrer noopener"
                variant="secondary"
                className="justify-center"
              >
                <Navigation aria-hidden className="size-4" />
                Построить маршрут
              </ButtonLink>
              <BookButton size="md" className="justify-center">
                Записаться на обслуживание
              </BookButton>
            </div>
          </div>

          {/* Map */}
          <div data-reveal="scale" className="beam panel overflow-hidden rounded-3xl">
            <div className="relative h-[320px] w-full sm:h-[420px] lg:h-full lg:min-h-[560px]">
              {/* Always-visible layer: keeps the block readable if the map
                  provider is unreachable, and labels the pin either way. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-ink-900"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <span className="grid size-12 place-items-center rounded-full border border-accent-500/40 bg-accent-500/12">
                  <MapPin aria-hidden className="size-6 text-accent-400" />
                </span>
                <span className="rounded-full border border-white/12 bg-ink-950/80 px-3.5 py-1.5 text-[12px] text-white/75">
                  Lux car · {VERIFIED.address}
                </span>
              </div>
              <iframe
                title="Lux car на карте: Новолодочная 45в, Семей"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${VERIFIED.geo.lng - 0.012},${VERIFIED.geo.lat - 0.007},${VERIFIED.geo.lng + 0.012},${VERIFIED.geo.lat + 0.007}&layer=mapnik&marker=${VERIFIED.geo.lat},${VERIFIED.geo.lng}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-dark absolute inset-0 size-full border-0"
              />
              <p className="pointer-events-none absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-ink-950/85 px-3 py-1.5 text-[12px] text-white/75">
                <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
                Lux car · {VERIFIED.address}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">Lux car</p>
                <p className="text-[12px] text-white/45">
                  {VERIFIED.address} · {VERIFIED.geo.lat}, {VERIFIED.geo.lng}
                </p>
              </div>
              <ButtonLink
                href={TWO_GIS.cardUrl}
                target="_blank"
                rel="noreferrer noopener"
                variant="ghost"
                size="sm"
                className="justify-center"
              >
                Открыть в 2ГИС
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
