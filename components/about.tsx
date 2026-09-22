import {
  BadgeCheck,
  Car,
  CircleDollarSign,
  Home,
  MapPin,
  TrainFront,
} from "lucide-react";

import { Badge, DemoChip, SectionHeading } from "@/components/ui";
import { TWO_GIS, VERIFIED } from "@/lib/company";
import { revealDelay } from "@/lib/utils";

const FACTS = [
  {
    icon: Car,
    title: "Работаем с легковыми автомобилями",
    text: `В карточке 2ГИС сервис отмечен по маркам ${VERIFIED.makes.join(", ")}. Приезжайте и на других марках — администратор подтвердит запись.`,
  },
  {
    icon: BadgeCheck,
    title: `${VERIFIED.ratingsCount} оценок и ${VERIFIED.reviewsCount} отзыва`,
    text: `Средняя оценка ${VERIFIED.rating} из 5 в 2ГИС. Мы не скрываем критику — часть отзывов ниже можно прочитать целиком.`,
  },
  {
    icon: CircleDollarSign,
    title: "Наличные и перевод с карты",
    text: "Способы оплаты, указанные в карточке 2ГИС. Итоговую сумму согласовываем до начала работ.",
  },
  {
    icon: Home,
    title: "Возможен выезд",
    text: "В услугах указан выезд на дом. Возможность и стоимость выезда уточняйте у администратора.",
  },
  {
    icon: MapPin,
    title: `Остановка «${VERIFIED.nearestStop.name}»`,
    text: `${VERIFIED.nearestStop.walk} пешком, около ${VERIFIED.nearestStop.distance} от сервиса — ${VERIFIED.district}.`,
  },
  {
    icon: TrainFront,
    title: "Открыто каждый день",
    text: `${VERIFIED.hours}. Запись через сайт — демонстрационный модуль: финальное время подтверждает администратор.`,
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-28 border-t border-white/[0.06] py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div data-reveal>
            <SectionHeading
              eyebrow="О компании"
              title="Lux car — сервис в Семее, куда возвращаются с той же машиной"
              description="Здесь нет красивых обещаний про «многолетний опыт». Есть адрес, режим работы, список работ и открытый рейтинг в 2ГИС — по нему и стоит принимать решение."
            />

            <div className="panel mt-8 space-y-4 rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <Badge tone="accent">Только проверяемые данные</Badge>
              </div>
              <p className="text-[13px] leading-relaxed text-white/55">
                Всё, что написано на этой странице про адрес, телефон, время
                работы, оплату и рейтинг, взято из карточки компании в 2ГИС. Всё,
                что является рекламным текстом или шаблоном, отмечено чипом{" "}
                <DemoChip className="align-middle" />.
              </p>
              <a
                href={TWO_GIS.cardUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex text-[13px] font-medium text-accent-400 underline decoration-accent-500/40 underline-offset-4 hover:text-accent-300"
              >
                Открыть карточку в 2ГИС
              </a>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {FACTS.map(({ icon: Icon, title, text }, index) => (
              <li
                key={title}
                data-reveal
                style={revealDelay(index * 60)}
                className="panel group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/16"
              >
                <Icon
                  aria-hidden
                  className="size-5 text-accent-400 transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="mt-4 text-[15px] leading-snug font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/50">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
