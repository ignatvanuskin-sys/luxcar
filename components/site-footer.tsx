import Link from "next/link";
import { Clock, LayoutDashboard, MapPin, Phone } from "lucide-react";

import { TWO_GIS, VERIFIED, VERIFIED_SERVICES } from "@/lib/company";

const NAVIGATION = [
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "О компании" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#process", label: "Как мы работаем" },
  { href: "#gallery", label: "Фотографии" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink-950 pb-28 sm:pb-0">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.14em] text-white">
              LUX<span className="text-accent-500">CAR</span>
            </p>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/45">
              Автосервис в Семее. Диагностика, обслуживание и ремонт легковых
              автомобилей по предварительной записи.
            </p>
            <div className="mt-6 space-y-2 text-[13px] text-white/50">
              <a
                href={VERIFIED.phoneHref}
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Phone aria-hidden className="size-3.5 text-accent-400" />
                {VERIFIED.phone}
              </a>
              <p className="flex items-center gap-2">
                <MapPin aria-hidden className="size-3.5 text-accent-400" />
                {VERIFIED.address}, {VERIFIED.city}
              </p>
              <p className="flex items-center gap-2">
                <Clock aria-hidden className="size-3.5 text-accent-400" />
                {VERIFIED.hours}
              </p>
            </div>
          </div>

          <nav aria-label="Навигация по сайту">
            <p className="text-[11px] tracking-[0.18em] text-white/35 uppercase">
              Разделы
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAVIGATION.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] text-white/55 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[11px] tracking-[0.18em] text-white/35 uppercase">
              Подтверждено в 2ГИС
            </p>
            <ul className="mt-4 space-y-2.5">
              {VERIFIED_SERVICES.slice(0, 6).map((service) => (
                <li key={service} className="text-[13px] text-white/55">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.18em] text-white/35 uppercase">
              Сервис
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/booking"
                  className="text-[13px] text-white/55 transition hover:text-white"
                >
                  Онлайн-запись
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 text-[13px] text-white/55 transition hover:text-white"
                >
                  <LayoutDashboard aria-hidden className="size-3.5" />
                  Демо-панель заявок
                </Link>
              </li>
              <li>
                <a
                  href={TWO_GIS.cardUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[13px] text-white/55 transition hover:text-white"
                >
                  Карточка в 2ГИС
                </a>
              </li>
              <li>
                <a
                  href={TWO_GIS.reviewsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[13px] text-white/55 transition hover:text-white"
                >
                  Отзывы в 2ГИС
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-white/[0.07] pt-6 text-[12px] leading-relaxed text-white/35">
          <p>
            Демонстрационный сайт. Адрес, телефон, время работы, способы оплаты,
            марки и рейтинг взяты из открытой карточки компании в 2ГИС. Разделы,
            отмеченные как «Демо», — шаблонное наполнение и требуют подтверждения
            владельцем. Фотографии на сайте — сгенерированные демонстрационные
            изображения, а не фото компании.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Lux car · {VERIFIED.city}, Казахстан</p>
            <p>Источник данных: 2ГИС, карточка {TWO_GIS.firmId}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
