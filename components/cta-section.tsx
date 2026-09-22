import Image from "next/image";
import { CalendarCheck, Phone } from "lucide-react";

import { BookButton } from "@/components/book-button";
import { ButtonLink } from "@/components/ui";
import { VERIFIED } from "@/lib/company";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.06]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/cta-service-hall.jpg"
          alt="Автомобиль в затемнённом сервисном зале"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink-950/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/80" />
        <div
          aria-hidden
          /* Positioned with insets only — the drift animation owns `transform`. */
          className="orb orb-b top-1/4 left-1/4 size-[20rem] bg-accent-500/10 sm:size-[34rem]"
        />
      </div>

      <div className="container-page py-24 lg:py-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-3xl leading-[1.1] font-semibold sm:text-4xl lg:text-[2.9rem]">
            Автомобиль требует внимания?
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
            Запишитесь в Lux car заранее: администратор подтвердит удобное время, а
            вы приедете без ожидания в очереди.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <BookButton size="lg" className="w-full sm:w-auto">
              <CalendarCheck aria-hidden className="size-5" />
              Записаться на обслуживание
            </BookButton>
            <ButtonLink
              href={VERIFIED.phoneHref}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Phone aria-hidden className="size-5 text-accent-400" />
              Позвонить
            </ButtonLink>
          </div>

          <p className="mt-6 text-[13px] text-white/45">
            {VERIFIED.address} · {VERIFIED.hours}
          </p>
        </div>
      </div>
    </section>
  );
}
