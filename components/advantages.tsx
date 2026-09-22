import { BookButton } from "@/components/book-button";
import { DemoChip, SectionHeading } from "@/components/ui";
import { revealDelay } from "@/lib/utils";

const ADVANTAGES = [
  {
    title: "Диагностика перед ремонтом",
    text: "Сначала разбираемся в проблеме. Потом предлагаем решение — а не меняем детали по кругу.",
  },
  {
    title: "Согласование объёма работ",
    text: "Показываем, что нашли, и называем стоимость до начала работ. Без «сюрпризов» в конце.",
  },
  {
    title: "Профильные направления",
    text: "Диагностика, электрика, газовое оборудование и слесарные работы в одном месте.",
  },
  {
    title: "Разговор на вашем языке",
    text: "Мастера общаются на казахском и русском — это отмечают клиенты в отзывах.",
  },
  {
    title: "Вечерние окна",
    text: "Сервис открыт ежедневно с 09:00 до 23:00: можно заехать после работы.",
  },
  {
    title: "Запись без звонков и очередей",
    text: "Заявка с сайта приходит администратору: он подтверждает время и берёт автомобиль в работу.",
  },
];

export function Advantages() {
  return (
    <section
      id="advantages"
      className="scroll-mt-28 border-t border-white/[0.06] py-20 lg:py-28"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Почему Lux car"
            title="Сервис, в котором понятно, за что вы платите"
            description="Ниже — рабочие принципы, по которым выстроен приём автомобилей. Это маркетинговое описание подхода, а не гарантии из карточки 2ГИС."
          />
          <div className="shrink-0">
            <BookButton size="lg" className="w-full sm:w-auto">
              Записаться на обслуживание
            </BookButton>
          </div>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((item, index) => (
            <li
              key={item.title}
              data-reveal="scale"
              style={revealDelay(Math.min(index, 5) * 50)}
              className="panel top-sheen group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/18"
            >
              <span
                aria-hidden
                className="font-display text-[2.6rem] leading-none font-bold text-white/[0.07] transition-colors duration-300 group-hover:text-accent-500/25"
              >
                {`0${index + 1}`}
              </span>
              <h3 className="mt-4 text-[17px] leading-snug font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">
                {item.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 flex items-center gap-2 text-[12px] text-white/35">
          <DemoChip />
          Формулировки блока — маркетинговая концепция демо-версии.
        </p>
      </div>
    </section>
  );
}
