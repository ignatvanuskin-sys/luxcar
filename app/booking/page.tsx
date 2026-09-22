import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone } from "lucide-react";

import { BookingFlow } from "@/components/booking/booking-flow";
import { DemoChip } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VERIFIED } from "@/lib/company";

export const metadata: Metadata = {
  title: "Онлайн-запись на обслуживание",
  description:
    "Запишитесь в автосервис Lux car в Семее: выберите услугу, дату и время. Администратор подтвердит запись.",
  alternates: { canonical: "/booking" },
};

const STEPS = [
  "Выбираете услугу и удобное время",
  "Указываете автомобиль: марку, модель и год",
  "Администратор подтверждает запись",
  "Приезжаете на Новолодочную, 45в",
];

export default function BookingPage() {
  return (
    <>
      <SiteHeader />
      <main className="pb-24 pt-32 lg:pt-40">
        <div className="container-page">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] text-white/45 transition hover:text-white"
          >
            <ArrowLeft aria-hidden className="size-3.5" />
            На главную
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div className="flex flex-col gap-7">
              <div>
                <h1 className="text-3xl leading-[1.1] font-semibold sm:text-4xl">
                  Онлайн-запись в Lux car
                </h1>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                  Пять коротких шагов — и администратор свяжется с вами для
                  подтверждения времени. Заявка не является подтверждённой
                  записью, пока её не проверит сервис.
                </p>
              </div>

              <ol className="space-y-4">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-accent-500/40 bg-accent-500/10 text-[12px] font-semibold text-accent-300">
                      {index + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-white/60">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="panel space-y-3 rounded-2xl p-5 text-[13px]">
                <p className="flex items-center gap-2 text-white/75">
                  <MapPin aria-hidden className="size-4 text-accent-400" />
                  {VERIFIED.address}, {VERIFIED.city}
                </p>
                <p className="flex items-center gap-2 text-white/75">
                  <Clock aria-hidden className="size-4 text-accent-400" />
                  {VERIFIED.hours}
                </p>
                <a
                  href={VERIFIED.phoneHref}
                  className="flex items-center gap-2 text-white/75 transition hover:text-white"
                >
                  <Phone aria-hidden className="size-4 text-accent-400" />
                  {VERIFIED.phone}
                </a>
                <p className="flex items-center gap-2 pt-1 text-[12px] text-white/35">
                  <DemoChip />
                  Форма сохраняет заявку в демо-хранилище проекта.
                </p>
              </div>
            </div>

            <div className="panel top-sheen rounded-3xl">
              <BookingFlow />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
