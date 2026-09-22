"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Phone,
  RotateCcw,
  Send,
} from "lucide-react";

import { Calendar } from "@/components/booking/calendar";
import { Button, DemoChip } from "@/components/ui";
import {
  BOOKING_HORIZON_DAYS,
  TIME_SLOTS,
  getBookingStore,
  validateCar,
  validateContact,
  type Booking,
  type BookingDraft,
} from "@/lib/booking";
import { VERIFIED } from "@/lib/company";
import { BOOKING_SERVICES, getServiceTitle } from "@/lib/services";
import {
  cn,
  formatDisplayDate,
  formatPhoneInput,
  formatShortDate,
  isPhoneComplete,
  startOfToday,
  toISODate,
  toInternationalPhone,
} from "@/lib/utils";

const STEP_TITLES = [
  "Что нужно автомобилю?",
  "Автомобиль",
  "Дата визита",
  "Удобное время",
  "Контактные данные",
] as const;

type FormState = {
  serviceId: string;
  carMake: string;
  carModel: string;
  carYear: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment: string;
};

const EMPTY_FORM: FormState = {
  serviceId: "",
  carMake: "",
  carModel: "",
  carYear: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  comment: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function BookingFlow({
  initialServiceId,
  onClose,
  compact = false,
}: {
  initialServiceId?: string;
  onClose?: () => void;
  compact?: boolean;
}) {
  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    serviceId: initialServiceId ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [created, setCreated] = useState<Booking | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError(null);
  };

  const today = useMemo(() => startOfToday(), []);
  const isToday = form.date === toISODate(today);

  /** Slots already in the past are hidden for today's bookings. */
  const availableSlots = useMemo(() => {
    if (!isToday) return [...TIME_SLOTS];
    const now = new Date();
    return TIME_SLOTS.filter((slot) => {
      const [hours] = slot.split(":").map(Number);
      return hours > now.getHours();
    });
  }, [isToday]);

  const validateStep = (index: number): FieldErrors => {
    if (index === 0) {
      return form.serviceId ? {} : { serviceId: "Выберите, что нужно сделать" };
    }
    if (index === 1) {
      return validateCar({
        carMake: form.carMake,
        carModel: form.carModel,
        carYear: form.carYear,
      });
    }
    if (index === 2) {
      return form.date ? {} : { date: "Выберите дату визита" };
    }
    if (index === 3) {
      return form.time ? {} : { time: "Выберите время" };
    }
    return validateContact({ name: form.name, phone: form.phone });
  };

  const goNext = () => {
    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, STEP_TITLES.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  /** Validates a single contact field as soon as the user leaves it. */
  const validateContactField = (key: "name" | "phone") => {
    const contactErrors = validateContact({ name: form.name, phone: form.phone });
    setErrors((current) => ({ ...current, [key]: contactErrors[key] }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contactErrors = validateContact({ name: form.name, phone: form.phone });
    if (Object.keys(contactErrors).length > 0) {
      setErrors(contactErrors);
      document
        .getElementById(contactErrors.name ? "booking-name" : "booking-phone")
        ?.focus();
      return;
    }

    const draft: BookingDraft = {
      serviceId: form.serviceId,
      serviceLabel: getServiceTitle(form.serviceId),
      carMake: form.carMake.trim(),
      carModel: form.carModel.trim(),
      carYear: form.carYear.trim(),
      date: form.date,
      time: form.time,
      name: form.name.trim(),
      phone: toInternationalPhone(form.phone),
      comment: form.comment.trim(),
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const booking = await getBookingStore().create(draft);
      setCreated(booking);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заявку. Попробуйте ещё раз.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setForm({ ...EMPTY_FORM, serviceId: initialServiceId ?? "" });
    setCreated(null);
    setErrors({});
    setSubmitError(null);
    setStep(initialServiceId ? 1 : 0);
  };

  /* ----------------------------- success ----------------------------- */

  if (created) {
    const rows = [
      { label: "Услуга", value: created.serviceLabel },
      {
        label: "Автомобиль",
        value: `${created.carMake} ${created.carModel}, ${created.carYear}`,
      },
      { label: "Дата", value: formatDisplayDate(created.date) },
      { label: "Время", value: created.time },
      { label: "Имя", value: created.name },
      { label: "Телефон", value: created.phone },
    ];

    return (
      <div className="animate-fade-in flex flex-col gap-6 px-5 py-8 text-center sm:px-8">
        <div className="mx-auto grid size-16 place-items-center rounded-full border border-accent-500/40 bg-accent-500/12">
          <svg viewBox="0 0 24 24" aria-hidden className="size-8">
            <path
              d="M5 12.5 10 17.5 19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-check text-accent-400"
              style={{ strokeDasharray: 48 }}
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Заявка отправлена</h3>
          <p className="text-sm text-white/60">
            Администратор свяжется с вами для подтверждения записи.
          </p>
        </div>

        <dl className="panel divide-y divide-white/[0.07] rounded-2xl text-left">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 px-4 py-3"
            >
              <dt className="text-[13px] text-white/45">{row.label}</dt>
              <dd className="text-right text-sm font-medium text-white">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="text-xs leading-relaxed text-white/40">
          Заявка пока не подтверждена: сначала её проверит администратор сервиса.
          Номер заявки: <span className="font-mono text-white/60">{created.id}</span>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              window.location.href = VERIFIED.phoneHref;
            }}
          >
            <Phone aria-hidden className="size-4" />
            {VERIFIED.phone}
          </Button>
          <Button type="button" variant="ghost" onClick={restart}>
            <RotateCcw aria-hidden className="size-4" />
            Новая заявка
          </Button>
          {onClose ? (
            <Button type="button" onClick={onClose}>
              Закрыть
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  /* ------------------------------- flow ------------------------------ */

  const progress = ((step + 1) / STEP_TITLES.length) * 100;

  return (
    <form
      onSubmit={submit}
      className="flex w-full min-w-0 flex-col gap-6 px-5 py-6 sm:px-7 sm:py-7"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-medium tracking-wider text-white/45 uppercase">
            Шаг {step + 1} из {STEP_TITLES.length}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{STEP_TITLES[step]}</span>
          </div>
        </div>
        <div
          className="h-1 overflow-hidden rounded-full bg-white/8"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Прогресс записи"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1 — service */}
      {step === 0 ? (
        <fieldset className="min-w-0 space-y-4">
          <legend className="text-lg font-semibold text-white sm:text-xl">
            Что нужно автомобилю?
          </legend>
          <div
            className={cn(
              "grid gap-2.5",
              compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4",
            )}
          >
            {BOOKING_SERVICES.map((option) => {
              const Icon = option.icon;
              const selected = form.serviceId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update("serviceId", option.id)}
                  className={cn(
                    "group flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-accent-500/60 bg-accent-500/10 shadow-[0_10px_30px_-18px_rgba(255,122,26,0.8)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/22 hover:bg-white/[0.06]",
                  )}
                >
                  <Icon
                    aria-hidden
                    className={cn(
                      "size-5 transition-colors",
                      selected ? "text-accent-400" : "text-white/55",
                    )}
                  />
                  <span className="text-sm font-medium text-white">{option.label}</span>
                  <span className="text-[11px] leading-snug text-white/45">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.serviceId} />
        </fieldset>
      ) : null}

      {/* Step 2 — car */}
      {step === 1 ? (
        <fieldset className="min-w-0 space-y-4">
          <legend className="text-lg font-semibold text-white sm:text-xl">
            Информация об автомобиле
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              id="booking-make"
              label="Марка"
              placeholder="Например, Toyota"
              value={form.carMake}
              onChange={(value) => update("carMake", value)}
              error={errors.carMake}
              list="booking-makes"
            />
            <Field
              id="booking-model"
              label="Модель"
              placeholder="Например, Camry"
              value={form.carModel}
              onChange={(value) => update("carModel", value)}
              error={errors.carModel}
            />
          </div>
          <div className="sm:max-w-[12rem]">
            <Field
              id="booking-year"
              label="Год выпуска"
              placeholder="2018"
              inputMode="numeric"
              maxLength={4}
              value={form.carYear}
              onChange={(value) => update("carYear", value.replace(/\D/g, ""))}
              error={errors.carYear}
            />
          </div>
          <datalist id="booking-makes">
            {VERIFIED.makes.map((make) => (
              <option key={make} value={make} />
            ))}
          </datalist>
          <p className="text-xs text-white/40">
            В 2ГИС сервис указан по маркам {VERIFIED.makes.join(", ")}. Если вашей
            марки нет в списке — просто впишите её, заявка всё равно уйдёт
            администратору.
          </p>
        </fieldset>
      ) : null}

      {/* Step 3 — date */}
      {step === 2 ? (
        <fieldset className="min-w-0 space-y-4">
          <legend className="text-lg font-semibold text-white sm:text-xl">
            Когда удобно приехать?
          </legend>
          <Calendar value={form.date} onChange={(iso) => update("date", iso)} horizonDays={BOOKING_HORIZON_DAYS} />
          <p className="flex items-center gap-2 text-sm text-white/60">
            <CalendarDays aria-hidden className="size-4 text-accent-400" />
            {form.date ? (
              <span>
                Выбрано: <span className="text-white">{formatDisplayDate(form.date)}</span>
              </span>
            ) : (
              <span>Выберите дату в календаре — записи доступны на 2 месяца вперёд.</span>
            )}
          </p>
          <FieldError message={errors.date} />
        </fieldset>
      ) : null}

      {/* Step 4 — time */}
      {step === 3 ? (
        <fieldset className="min-w-0 space-y-4">
          <legend className="text-lg font-semibold text-white sm:text-xl">
            Удобное время
          </legend>
          <p className="flex items-center gap-2 text-sm text-white/60">
            <Clock aria-hidden className="size-4 text-accent-400" />
            {form.date
              ? `${formatShortDate(form.date)} · ${VERIFIED.hours}`
              : VERIFIED.hours}
          </p>
          {availableSlots.length === 0 ? (
            <p className="panel rounded-xl p-4 text-sm text-white/60">
              На сегодня свободных слотов для онлайн-записи не осталось. Выберите
              другую дату или позвоните: {VERIFIED.phone}.
            </p>
          ) : (
            <div className="no-scrollbar -mx-1 flex w-full min-w-0 gap-2.5 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible">
              {availableSlots.map((slot) => {
                const selected = form.time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update("time", slot)}
                    className={cn(
                      "h-12 min-w-[5.25rem] shrink-0 rounded-xl border text-sm font-medium tabular-nums transition-all duration-200 sm:min-w-0",
                      selected
                        ? "border-accent-500/60 bg-accent-500 text-ink-950"
                        : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/25 hover:bg-white/[0.07]",
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
          <p className="flex items-center gap-2 text-xs text-white/40">
            <DemoChip />
            Сетка времени — демонстрационная. Сервис открыт {VERIFIED.hours.toLowerCase()}, окончательное время подтвердит администратор.
          </p>
          <FieldError message={errors.time} />
        </fieldset>
      ) : null}

      {/* Step 5 — contacts */}
      {step === 4 ? (
        <fieldset className="min-w-0 space-y-4">
          <legend className="text-lg font-semibold text-white sm:text-xl">
            Как с вами связаться?
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              id="booking-name"
              label="Имя"
              placeholder="Как к вам обращаться"
              autoComplete="name"
              value={form.name}
              onChange={(value) => update("name", value)}
              onBlur={() => validateContactField("name")}
              error={errors.name}
            />
            <Field
              id="booking-phone"
              label="Телефон"
              placeholder="700 123-45-67"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              prefix="+7"
              value={form.phone}
              onChange={(value) => update("phone", formatPhoneInput(value))}
              onBlur={() => validateContactField("phone")}
              error={errors.phone}
              hint={
                form.phone && !isPhoneComplete(form.phone)
                  ? "Введите номер полностью: 10 цифр после +7"
                  : undefined
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="booking-comment"
              className="block text-[13px] font-medium text-white/70"
            >
              Комментарий <span className="text-white/35">(необязательно)</span>
            </label>
            <textarea
              id="booking-comment"
              rows={3}
              value={form.comment}
              onChange={(event) => update("comment", event.target.value)}
              placeholder="Опишите симптом: стук, запах, ошибка на панели…"
              className="w-full resize-none rounded-xl border border-white/10 bg-ink-900/80 px-3.5 py-3 text-sm text-white placeholder:text-white/25 focus:border-accent-500/60 focus:outline-none"
            />
          </div>

          <div className="panel space-y-2 rounded-xl p-4 text-sm">
            <p className="font-medium text-white">Проверьте данные</p>
            <ul className="space-y-1 text-[13px] text-white/60">
              <li>Услуга: {getServiceTitle(form.serviceId)}</li>
              <li>
                Автомобиль: {form.carMake || "—"} {form.carModel || ""}
                {form.carYear ? `, ${form.carYear}` : ""}
              </li>
              <li>
                Визит: {form.date ? formatDisplayDate(form.date) : "—"}
                {form.time ? `, ${form.time}` : ""}
              </li>
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-white/40">
            Отправляя заявку, вы соглашаетесь на обработку контактных данных для
            подтверждения записи. Это демонстрационная форма: данные сохраняются
            в демо-хранилище проекта.
          </p>
        </fieldset>
      ) : null}

      {submitError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={step === 0}
          className="justify-center"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Назад
        </Button>

        {step < STEP_TITLES.length - 1 ? (
          <Button type="button" size="lg" onClick={goNext} className="justify-center">
            Далее
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        ) : (
          <Button type="submit" size="lg" loading={submitting} className="justify-center">
            {submitting ? (
              "Отправляем…"
            ) : (
              <>
                <Send aria-hidden className="size-4" />
                Отправить заявку
              </>
            )}
          </Button>
        )}
      </div>

    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Field primitives                                                    */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  prefix,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  list,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  /** Static, non-editable prefix rendered inside the field (e.g. "+7"). */
  prefix?: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  maxLength?: number;
  list?: string;
}) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[13px] font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-white/45"
          >
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          name={id}
          type={type}
          list={list}
          value={value}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-12 w-full rounded-xl border bg-ink-900/80 px-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none",
            prefix && "pl-11",
            error
              ? "border-red-500/60 focus:border-red-500"
              : "border-white/10 focus:border-accent-500/60",
          )}
        />
      </div>
      {error ? (
        <FieldError id={messageId} message={error} />
      ) : hint ? (
        <p id={messageId} className="text-[12px] text-white/40">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[12px] text-red-300">
      {message}
    </p>
  );
}
