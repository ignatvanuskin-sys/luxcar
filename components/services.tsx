import { ChevronRight, Phone } from "lucide-react";

import { BookButton } from "@/components/book-button";
import { Badge, DemoChip, SectionHeading } from "@/components/ui";
import { TWO_GIS, VERIFIED } from "@/lib/company";
import { SERVICES } from "@/lib/services";
import { revealDelay } from "@/lib/utils";

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-28 border-t border-white/[0.06] bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Услуги"
          title="С чем приезжают в Lux car"
          description="Выберите направление — форма записи подставит его автоматически. Стоимость называем после осмотра, а не «по телефону наугад»."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <li
                key={service.id}
                data-reveal
                style={revealDelay(Math.min(index, 5) * 50)}
                className="panel group flex flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-500/35 hover:shadow-[0_28px_60px_-32px_rgba(255,122,26,0.45)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors duration-300 group-hover:border-accent-500/40 group-hover:bg-accent-500/10">
                    <Icon
                      aria-hidden
                      className="size-5 text-white/70 transition-colors duration-300 group-hover:text-accent-400"
                    />
                  </span>
                  {service.verified ? (
                    <Badge
                      tone="outline"
                      className="border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200/90"
                      title="Направление указано в карточке компании в 2ГИС или подтверждено отзывами"
                    >
                      в 2ГИС
                    </Badge>
                  ) : (
                    <DemoChip />
                  )}
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/50">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                  <span className="text-[12px] text-white/40">{service.priceNote}</span>
                  <BookButton serviceId={service.id} size="sm" variant="secondary">
                    Записаться
                    <ChevronRight aria-hidden className="size-4" />
                  </BookButton>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="panel mt-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[13px] leading-relaxed text-white/50">
            Цены на сайте не публикуем намеренно: в карточке 2ГИС есть раздел с
            ценами, но конкретные суммы зависят от автомобиля и объёма работ. Не
            нашли свою услугу — опишите проблему в комментарии к заявке.
            <span className="mt-2 flex items-center gap-2 text-white/35">
              <DemoChip />
              Каталог направлений и формулировки — шаблон демо-версии.
            </span>
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={VERIFIED.phoneHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/14 px-4 text-sm font-medium text-white transition hover:border-white/28"
            >
              <Phone aria-hidden className="size-4 text-accent-400" />
              {VERIFIED.phone}
            </a>
            <a
              href={TWO_GIS.reviewsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              Цены в 2ГИС
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
