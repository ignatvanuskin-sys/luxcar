/**
 * Reviews shown on the site.
 *
 * These are REAL reviews of Lux car taken from the public 2GIS reviews API
 * (branch 70000001065992611) on 2026-09-22. Texts are reproduced verbatim,
 * including typos and negative ratings — the block must stay honest.
 *
 * Source: https://2gis.kz/semej/firm/70000001065992611/tab/reviews
 */

export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  text: string;
  /** Set when the review mentions a specific kind of work. */
  topic?: string;
};

export const REVIEWS: Review[] = [
  {
    id: "197103478",
    author: "Ержан Аргынов",
    rating: 5,
    date: "2 ноября 2025",
    topic: "ГБО, ремонт в ночное время",
    text: "Ехал с Астаны в Аягоз назад чёт начало троить, пыхтеть чихать и кашлять. Думал из-за не качественного газа. Ночью позвонил заехал до Антона. На слух вердикт редуктор. Поменяли нашли косяки по форсам, полтора часа работ и вуаля. Я щас пилот а гбо автопилот. До Астаны долетел лучше чем на бензине!!! Цены и обслуживание норм.",
  },
  {
    id: "196633868",
    author: "Рус Рус",
    rating: 5,
    date: "31 октября 2025",
    topic: "Обслуживание клиентов",
    text: "Незнаю как у вас, но меня обслуживали отличные мастера. В сто с клиентами разговаривают вежливо. Я доволен сервисом. Мастер Антон владеют обеими языками. То есть если не сможешь донести свои мысли на русском, то смело говори на казахском😆",
  },
  {
    id: "244604447",
    author: "Азамат Шарипханов",
    rating: 5,
    date: "24 мая 2026",
    text: "Очень хорошие ребята знают свою работу",
  },
  {
    id: "130501117",
    author: "Абай Оралбеков",
    rating: 5,
    date: "28 декабря 2024",
    topic: "Автоэлектрика",
    text: "Автоэлектрик Жасик, нағыз өз маманынң шебері, жасағаны ұқыпты, с результатом 👍",
  },
  {
    id: "201147474",
    author: "Нурлан Матаубаев",
    rating: 5,
    date: "20 ноября 2025",
    text: "Доехал без проблем",
  },
  {
    id: "139404687",
    author: "Мадияр Айткужанов",
    rating: 5,
    date: "13 февраля 2025",
    text: "Молодцы парни, оперативно",
  },
  {
    id: "211547473",
    author: "Темирлан Жумагазыев",
    rating: 1,
    date: "12 января 2026",
    text: "Не советую, пофиг на клиентов, лишь б сделать бабки содрать, все некачественно, если не хотите взорваться, сгореть, то не стоит туда",
  },
  {
    id: "174210124",
    author: "Zhalgas Dusengazin",
    rating: 1,
    date: "25 июля 2025",
    topic: "Качество запчастей",
    text: "Низкое качество запчастей",
  },
  {
    id: "193891822",
    author: "Kana Kanych",
    rating: 1,
    date: "19 октября 2025",
    text: "Некомпетентный так называемый мастер Антон. Не советую. деньги взял но не устранил проблему.",
  },
  {
    id: "174748516",
    author: "Алина .",
    rating: 1,
    date: "28 июля 2025",
    text: "Грубое отношение, ужас, не советую👎🏻👎🏻👎🏻",
  },
  {
    id: "262997968",
    author: "Сергей Орлов",
    rating: 1,
    date: "30 июля 2026",
    text: "Не советую",
  },
];

/**
 * Honest one-line summary of what the source shows: the average is high, but
 * the negative reviews cluster around spare-part quality and communication.
 * Rendered next to the reviews so the demo does not oversell the company.
 */
export const REVIEWS_INSIGHT =
  "Показываем отзывы как есть, включая критику: часть жалоб касается качества запчастей и общения с клиентами. Это реальные оценки из 2ГИС, а не подборка.";
