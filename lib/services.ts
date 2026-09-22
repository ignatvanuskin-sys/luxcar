import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  CircleDot,
  Cog,
  Droplets,
  Flame,
  Gauge,
  ScanLine,
  Settings2,
  Snowflake,
  Wrench,
} from "lucide-react";

/**
 * Service catalogue.
 *
 * `verified` is true only for directions that are actually listed on the Lux car
 * 2GIS card (directory rubrics) or are directly confirmed by customer reviews.
 * Every other card is template content for the demo and is rendered with a
 * "Демо" chip. No prices are invented anywhere — unknown price is replaced by a
 * call to action, never by a number.
 */

export type Service = {
  id: string;
  title: string;
  description: string;
  priceNote: string;
  icon: LucideIcon;
  verified: boolean;
};

export const SERVICES: Service[] = [
  {
    id: "diagnostics",
    title: "Диагностика",
    description:
      "Не знаете, откуда появился стук или почему загорелся «чек»? Начинаем с диагностики, а не с замены деталей наугад.",
    priceNote: "Стоимость — после диагностики",
    icon: ScanLine,
    verified: true,
  },
  {
    id: "lpg",
    title: "Газовое оборудование (ГБО)",
    description:
      "Обслуживание и ремонт газового оборудования: редуктор, форсунки, настройка. Одно из основных направлений сервиса.",
    priceNote: "Стоимость — после осмотра",
    icon: Flame,
    verified: true,
  },
  {
    id: "maintenance",
    title: "Техническое обслуживание",
    description:
      "Плановое ТО: расходники, жидкости, фильтры, проверка узлов. Приезжаете один раз — уезжаете с закрытым списком.",
    priceNote: "Уточнить стоимость",
    icon: Settings2,
    verified: false,
  },
  {
    id: "oil",
    title: "Замена масла",
    description:
      "Замена масла и фильтров с подбором по допуску производителя. Быстро и без очередей по предварительной записи.",
    priceNote: "Уточнить стоимость",
    icon: Droplets,
    verified: true,
  },
  {
    id: "electric",
    title: "Электрика",
    description:
      "Проводка, стартер, генератор, датчики. Ищем причину, а не меняем блоки по очереди.",
    priceNote: "Стоимость — после диагностики",
    icon: BatteryCharging,
    verified: true,
  },
  {
    id: "engine",
    title: "Ремонт двигателя",
    description:
      "От замены навесного оборудования до более серьёзных работ. Объём и смету согласуем до начала ремонта.",
    priceNote: "Стоимость — после диагностики",
    icon: Cog,
    verified: false,
  },
  {
    id: "suspension",
    title: "Ходовая часть",
    description:
      "Стук на неровностях? Проверим подвеску и покажем, что действительно требует замены.",
    priceNote: "Стоимость — после осмотра",
    icon: Gauge,
    verified: false,
  },
  {
    id: "brakes",
    title: "Тормозная система",
    description:
      "Колодки, диски, суппорты, тормозная жидкость. Работы, которые лучше не откладывать.",
    priceNote: "Стоимость — после осмотра",
    icon: CircleDot,
    verified: false,
  },
  {
    id: "ac",
    title: "Кондиционер",
    description:
      "Диагностика, заправка и ремонт системы кондиционирования. Проверим герметичность перед заправкой.",
    priceNote: "Уточнить стоимость",
    icon: Snowflake,
    verified: false,
  },
  {
    id: "welding",
    title: "Сварочные работы",
    description:
      "Сварочные работы по кузову и выпускной системе. Объём оцениваем после осмотра автомобиля.",
    priceNote: "Стоимость — после осмотра",
    icon: Wrench,
    verified: true,
  },
];

/** Service presets for step 1 of the booking flow. */
export type BookingServiceOption = {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

export const BOOKING_SERVICES: BookingServiceOption[] = [
  { id: "diagnostics", label: "Диагностика", hint: "Найти причину", icon: ScanLine },
  { id: "maintenance", label: "ТО", hint: "Плановое обслуживание", icon: Settings2 },
  { id: "lpg", label: "ГБО", hint: "Газовое оборудование", icon: Flame },
  { id: "electric", label: "Электрика", hint: "Проводка и датчики", icon: BatteryCharging },
  { id: "engine", label: "Ремонт", hint: "Двигатель и узлы", icon: Cog },
  { id: "suspension", label: "Ходовая", hint: "Подвеска и рулевое", icon: Gauge },
  { id: "brakes", label: "Тормоза", hint: "Колодки, диски", icon: CircleDot },
  { id: "other", label: "Другое", hint: "Опишу в комментарии", icon: Wrench },
];

export function getServiceTitle(id: string): string {
  return (
    BOOKING_SERVICES.find((option) => option.id === id)?.label ??
    SERVICES.find((service) => service.id === id)?.title ??
    "Обслуживание"
  );
}
