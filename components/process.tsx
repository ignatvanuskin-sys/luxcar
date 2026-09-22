import { BookButton } from "@/components/book-button";
import { SectionHeading } from "@/components/ui";
import { revealDelay } from "@/lib/utils";

const STEPS = [
  {
    title: "Оставляете заявку",
    text: "Выбираете услугу, дату и время на сайте. Заявка приходит администратору, он подтверждает запись.",
  },
  {
    title: "Привозите автомобиль",
    text: "Приезжаете в подтверждённое время на Новолодочную, 45в. Уточняем жалобы и детали эксплуатации.",
  },
  {
    title: "Диагностика и согласование",
    text: "Проверяем автомобиль, показываем результат и называем стоимость работ до начала ремонта.",
  },
  {
    title: "Забираете готовый автомобиль",
    text: "Выполняем согласованный объём работ и отдаём машину с пояснением, что именно сделано.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-28 border-t border-white/[0.06] bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Как мы работаем"
          title="Четыре шага от заявки до готового автомобиля"
          description="Прозрачный процесс: вы всегда знаете, на каком этапе машина и что будет сделано дальше."
        />

        <ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[11px] w-px bg-gradient-to-b from-accent-500/50 via-white/12 to-transparent lg:top-[11px] lg:bottom-auto lg:left-0 lg:h-px lg:w-full lg:bg-gradient-to-r"
          />

          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-reveal
              style={revealDelay(index * 80)}
              className="relative pl-10 lg:pl-0"
            >
              <span className="absolute top-0 left-0 grid size-6 place-items-center rounded-full border border-accent-500/50 bg-ink-950 lg:static lg:mb-5">
                <span aria-hidden className="size-2 rounded-full bg-accent-500" />
              </span>
              <p className="font-display text-[12px] font-semibold tracking-[0.22em] text-accent-400">
                {`0${index + 1}`}
              </p>
              <h3 className="mt-3 text-[17px] leading-snug font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <BookButton size="lg" className="w-full sm:w-auto">
            Записаться на обслуживание
          </BookButton>
          <p className="text-[13px] text-white/45">
            Занимает меньше минуты. Время подтверждает администратор.
          </p>
        </div>
      </div>
    </section>
  );
}
