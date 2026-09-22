import { ExternalLink, Quote } from "lucide-react";

import { BookButton } from "@/components/book-button";
import { SectionHeading, Stars } from "@/components/ui";
import { TWO_GIS, VERIFIED } from "@/lib/company";
import { REVIEWS, REVIEWS_INSIGHT } from "@/lib/reviews";
import { revealDelay } from "@/lib/utils";

export function Reviews() {
  return (
    <section
      id="reviews"
      className="scroll-mt-28 border-t border-white/[0.06] bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Отзывы"
            title="Что пишут клиенты в 2ГИС"
            description="Отзывы приведены дословно, включая критику и орфографию авторов. Это публичные отзывы из 2ГИС, а не тексты, написанные для сайта."
          />
          <a
            href={TWO_GIS.reviewsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-white/14 px-5 text-sm font-medium text-white transition hover:border-white/30"
          >
            Все {VERIFIED.reviewsCount} отзывов в 2ГИС
            <ExternalLink aria-hidden className="size-4" />
          </a>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <li
              key={review.id}
              data-reveal="scale"
              style={revealDelay(Math.min(index, 5) * 50)}
              className="panel flex flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/16"
            >
              <div className="flex items-center justify-between gap-3">
                <Stars rating={review.rating} />
                <span className="text-[12px] text-white/35">{review.date}</span>
              </div>

              <Quote
                aria-hidden
                className="mt-4 size-4 text-white/15"
              />

              <blockquote className="mt-2 flex-1 text-[13px] leading-relaxed text-white/70">
                {review.text}
              </blockquote>

              <footer className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                <span className="text-[13px] font-medium text-white/85">
                  {review.author}
                </span>
                {review.topic ? (
                  <span className="text-[11px] text-white/35">{review.topic}</span>
                ) : (
                  <span className="text-[11px] text-white/30">Источник: 2ГИС</span>
                )}
              </footer>
            </li>
          ))}
        </ul>

        <div className="panel mt-6 flex flex-col gap-5 rounded-2xl p-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-[13px] leading-relaxed text-white/55">
            {REVIEWS_INSIGHT}
          </p>
          <BookButton size="lg" className="shrink-0">
            Записаться на обслуживание
          </BookButton>
        </div>
      </div>
    </section>
  );
}
