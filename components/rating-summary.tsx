import { ExternalLink, MessageSquare, Star } from "lucide-react";

import { CountUp } from "@/components/count-up";
import { ButtonLink } from "@/components/ui";
import { TWO_GIS, VERIFIED } from "@/lib/company";

/**
 * The rating block is deliberately honest: the number shown is the real 2GIS
 * average, and the negative share is stated instead of hidden.
 */
export function RatingSummary() {
  const stats = [
    {
      label: "Оценок в 2ГИС",
      value: VERIFIED.ratingsCount,
      hint: "средняя оценка учитывает все оценки карточки",
    },
    {
      label: "Отзывов с текстом",
      value: VERIFIED.reviewsCount,
      hint: "открытая лента отзывов в 2ГИС",
    },
    {
      label: "Фотографий",
      value: VERIFIED.photosCount,
      hint: "в галерее карточки компании",
    },
  ];

  return (
    <section className="scroll-mt-28 border-t border-white/[0.06] py-20 lg:py-24">
      <div className="container-page">
        <div className="beam panel top-sheen overflow-hidden rounded-3xl">
          <div className="grid gap-10 p-7 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
            <div data-reveal className="flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-[11px] font-medium tracking-wider text-accent-300 uppercase">
                <Star aria-hidden className="size-3.5 fill-accent-500 text-accent-500" />
                Рейтинг
              </span>

              <div className="flex items-end gap-3">
                <span className="font-display text-[4.25rem] leading-none font-bold text-white">
                  <CountUp value={VERIFIED.rating} decimals={1} durationMs={1200} />
                </span>
                <div className="pb-2">
                  <p className="text-sm text-white/55">из 5</p>
                  <p className="text-[13px] text-white/40">2ГИС</p>
                </div>
              </div>

              <p className="text-[13px] leading-relaxed text-white/55">
                Средняя оценка карточки — {VERIFIED.rating} из 5 при{" "}
                {VERIFIED.ratingsCount} оценках. Часть отзывов отрицательные: они
                касаются качества запчастей и общения. Мы не удаляем такие отзывы
                с этой страницы.
              </p>

              <ButtonLink
                href={TWO_GIS.cardUrl}
                target="_blank"
                rel="noreferrer noopener"
                variant="secondary"
              >
                Источник: карточка 2ГИС
                <ExternalLink aria-hidden className="size-4" />
              </ButtonLink>
            </div>

            <div data-reveal className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <p className="font-display text-2xl font-bold text-white">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-white/70">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/35">
                    {stat.hint}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:col-span-3">
                <p className="flex items-center gap-2 text-[13px] font-medium text-white/70">
                  <MessageSquare aria-hidden className="size-4 text-accent-400" />
                  Что важно знать перед записью
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-white/40">
                  Положительные отзывы чаще всего касаются работы мастера Антона
                  (газовое оборудование) и автоэлектрика. Отрицательные — качества
                  запчастей, гарантии и общения с клиентом. Оценивайте оба списка:
                  мы специально оставили их оба на этой странице.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
