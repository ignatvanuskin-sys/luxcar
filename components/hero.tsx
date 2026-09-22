import Image from "next/image";
import {
  ArrowDown,
  CalendarCheck,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { BookButton } from "@/components/book-button";
import { CountUp } from "@/components/count-up";
import { Badge, ButtonLink } from "@/components/ui";
import { TWO_GIS, VERIFIED } from "@/lib/company";
import { riseDelay } from "@/lib/utils";

const HIGHLIGHTS = [
  { icon: Clock, text: VERIFIED.hours },
  { icon: MapPin, text: `${VERIFIED.address}, ${VERIFIED.city}` },
  { icon: ShieldCheck, text: "Наличные и перевод с карты" },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 lg:pt-32">
      {/* Background: the image drifts as the page scrolls where the browser
          supports scroll-driven animations, everything else stays static. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-service-bay.jpg"
          alt="Автомобиль на подъёмнике в сервисном боксе Lux Car"
          fill
          priority
          sizes="100vw"
          className="parallax-hero object-cover object-[62%_center]"
        />
        {/* Left side stays fully dark for text contrast, the right side keeps
            the service bay readable instead of crushing it to black. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/55" />
        <div
          aria-hidden
          className="orb orb-a -top-28 -left-24 size-[22rem] bg-accent-500/12 sm:size-[30rem]"
        />
        <div
          aria-hidden
          className="orb orb-b top-1/4 -right-24 size-[18rem] bg-accent-600/10 sm:size-[26rem]"
        />
      </div>

      <div className="container-page pb-16 lg:pb-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="flex w-full min-w-0 flex-col items-start gap-7">
            <div className="rise" style={riseDelay(0)}>
              <Badge tone="outline" className="border-white/15 bg-white/[0.05] text-white/70">
                <span className="size-1.5 rounded-full bg-accent-500" />
                {VERIFIED.city} • {VERIFIED.category}
              </Badge>
            </div>

            <h1 className="text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]">
              <span className="rise block" style={riseDelay(70)}>
                Обслуживаем автомобиль так,
              </span>
              <span className="rise block text-white/45" style={riseDelay(150)}>
                чтобы вы могли спокойно ехать дальше.
              </span>
            </h1>

            <p
              className="rise max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base"
              style={riseDelay(240)}
            >
              Диагностика, обслуживание и ремонт автомобилей в Семее. Начинаем с
              диагностики и согласовываем работы до того, как возьмёмся за
              ремонт.
            </p>

            <div
              className="rise flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
              style={riseDelay(320)}
            >
              <BookButton size="lg" sheen className="w-full sm:w-auto">
                <CalendarCheck aria-hidden className="size-5" />
                Записаться на обслуживание
              </BookButton>
              <ButtonLink
                href="#services"
                variant="secondary"
                size="lg"
                className="press w-full sm:w-auto"
              >
                Посмотреть услуги
              </ButtonLink>
            </div>

            <ul
              className="rise flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[13px] text-white/50"
              style={riseDelay(410)}
            >
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-2">
                  <Icon aria-hidden className="size-4 text-accent-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Fact card: only verified data from the 2GIS card */}
          <aside
            className="rise beam panel top-sheen w-full min-w-0 rounded-3xl p-6 lg:p-7"
            style={riseDelay(210)}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
                  Рейтинг в 2ГИС
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-4xl leading-none font-bold text-white">
                    <CountUp value={VERIFIED.rating} decimals={1} durationMs={1100} />
                  </span>
                  <span className="text-sm text-white/45">из 5</span>
                </div>
                <p className="mt-2 text-[13px] text-white/50">
                  {VERIFIED.ratingsCount} оценок · {VERIFIED.reviewsCount} отзывов
                </p>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl border border-accent-500/30 bg-accent-500/10">
                <Star aria-hidden className="size-5 fill-accent-500 text-accent-500" />
              </span>
            </div>

            <div className="hairline my-6" />

            <dl className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-white/45">Адрес</dt>
                <dd className="text-right font-medium text-white">
                  {VERIFIED.address}
                  <span className="block text-[12px] font-normal text-white/40">
                    {VERIFIED.district}
                  </span>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-white/45">Часы работы</dt>
                <dd className="text-right font-medium text-white">{VERIFIED.hours}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-white/45">Марки</dt>
                <dd className="text-right font-medium text-white">
                  {VERIFIED.makes.join(" · ")}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-[12px] leading-relaxed text-white/35">
              Данные карточки{" "}
              <a
                href={TWO_GIS.cardUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/55 underline decoration-white/20 underline-offset-2 hover:text-accent-400"
              >
                2ГИС
              </a>
              . Свободное время подтверждает администратор после заявки.
            </p>
          </aside>
        </div>

        <a
          href="#services"
          className="rise mt-14 hidden items-center gap-2 text-[12px] tracking-[0.18em] text-white/35 uppercase transition hover:text-white/70 lg:inline-flex"
          style={riseDelay(520)}
        >
          <ArrowDown aria-hidden className="size-4" />
          Услуги и запись
        </a>
      </div>
    </section>
  );
}
