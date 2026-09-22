"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { DemoChip, SectionHeading } from "@/components/ui";
import { VERIFIED } from "@/lib/company";
import { cn } from "@/lib/utils";

type Category = "Автомобили" | "Сервис" | "Ремонт" | "Детали" | "Рабочий процесс";

type Photo = {
  src: string;
  alt: string;
  caption: string;
  categories: Category[];
};

const PHOTOS: Photo[] = [
  {
    src: "/images/hero-service-bay.jpg",
    alt: "Автомобиль на двухстоечном подъёмнике в светлом сервисном боксе",
    caption: "Рабочий бокс: автомобиль на подъёмнике",
    categories: ["Автомобили", "Сервис"],
  },
  {
    src: "/images/gallery-diagnostics.jpg",
    alt: "Диагностический сканер подключён к подкапотному пространству автомобиля",
    caption: "Компьютерная диагностика",
    categories: ["Сервис", "Рабочий процесс"],
  },
  {
    src: "/images/gallery-engine.jpg",
    alt: "Мастер работает с открытым подкапотным пространством автомобиля",
    caption: "Работы по двигателю",
    categories: ["Ремонт", "Рабочий процесс"],
  },
  {
    src: "/images/gallery-lift.jpg",
    alt: "Осмотр ходовой части автомобиля снизу с фонарём",
    caption: "Осмотр снизу: ходовая часть",
    categories: ["Ремонт", "Автомобили"],
  },
  {
    src: "/images/gallery-electric.jpg",
    alt: "Проверка электрики автомобиля мультиметром",
    caption: "Автоэлектрика: поиск неисправности",
    categories: ["Ремонт", "Рабочий процесс"],
  },
  {
    src: "/images/gallery-tools.jpg",
    alt: "Инструмент, тормозной диск и колодки на верстаке",
    caption: "Инструмент и детали",
    categories: ["Детали"],
  },
  {
    src: "/images/cta-service-hall.jpg",
    alt: "Автомобиль в затемнённом сервисном зале",
    caption: "Выдача автомобиля после работ",
    categories: ["Автомобили"],
  },
];

const FILTERS: Array<"Все" | Category> = [
  "Все",
  "Автомобили",
  "Сервис",
  "Ремонт",
  "Детали",
  "Рабочий процесс",
];

export function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      filter === "Все"
        ? PHOTOS
        : PHOTOS.filter((photo) => photo.categories.includes(filter)),
    [filter],
  );

  const close = useCallback(() => setActiveIndex(null), []);

  const move = useCallback(
    (delta: number) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        const next = (current + delta + visible.length) % visible.length;
        return next;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, move]);

  const active = activeIndex === null ? null : visible[activeIndex];
  const activePosition = activeIndex === null ? 0 : activeIndex + 1;

  return (
    <section
      id="gallery"
      className="scroll-mt-28 border-t border-white/[0.06] py-20 lg:py-28"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Фотографии"
            title="Как выглядит работа в сервисе"
            description="Автомобили, диагностика, ремонт и детали — то, что видит клиент, когда приезжает."
          />
          <p className="flex items-center gap-2 text-[12px] text-white/35">
            <DemoChip />
            Демонстрационные изображения. В карточке 2ГИС у компании {VERIFIED.photosCount} фото.
          </p>
        </div>

        <div
          role="group"
          aria-label="Фильтр фотографий"
          className="no-scrollbar mt-10 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={cn(
                "press h-11 shrink-0 rounded-full border px-4 text-[13px] font-medium transition sm:h-9",
                filter === item
                  ? "border-accent-500/50 bg-accent-500/12 text-accent-300"
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/22 hover:text-white/85",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="panel mt-8 rounded-2xl p-8 text-center text-sm text-white/50">
            В этой категории пока нет фотографий. Выберите другую категорию.
          </p>
        ) : (
          <ul className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
            {visible.map((photo, index) => (
              <li key={photo.src} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Открыть фото: ${photo.caption}`}
                  className="press group relative block w-full overflow-hidden rounded-2xl border border-white/[0.08] transition duration-300 hover:border-white/20"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1400}
                    height={933}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95"
                  />
                  <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-left">
                    <span className="text-[13px] font-medium text-white/90">
                      {photo.caption}
                    </span>
                    <span className="grid size-8 place-items-center rounded-lg border border-white/15 bg-black/40 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Expand aria-hidden className="size-3.5" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {active ? (
        <div
          className="animate-fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть просмотр"
            className="absolute top-5 right-5 grid size-11 place-items-center rounded-xl border border-white/12 text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <X aria-hidden className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Предыдущее фото"
            className="absolute left-3 grid size-11 place-items-center rounded-xl border border-white/12 text-white/80 transition hover:border-white/30 hover:text-white sm:left-8"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>

          <figure className="animate-pop-in max-h-full w-full max-w-5xl">
            <Image
              src={active.src}
              alt={active.alt}
              width={1400}
              height={933}
              sizes="100vw"
              className="mx-auto max-h-[76vh] w-auto max-w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/60">
              {active.caption}
              <span className="mt-1 block text-[12px] text-white/30">
                {activePosition} / {visible.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Следующее фото"
            className="absolute right-3 grid size-11 place-items-center rounded-xl border border-white/12 text-white/80 transition hover:border-white/30 hover:text-white sm:right-8"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
