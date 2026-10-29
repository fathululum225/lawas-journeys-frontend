'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { formatRupiah } from '@/lib/utils';
import { useI18n } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import type { PaymentSession } from '@/types';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Icon, type IconName } from '@/components/shared/Icon';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { BookingSummary } from './BookingSummary';

const METHOD_ICONS: Record<string, IconName> = { 'Virtual Account': 'credit-card', 'E-Wallet & QR': 'send', Card: 'credit-card' };

const groupMethods = (methods: PaymentSession['methods']): Array<[string, PaymentSession['methods']]> => {
  const groups = new Map<string, PaymentSession['methods']>();
  methods.forEach((method) => groups.set(method.group, [...(groups.get(method.group) ?? []), method]));
  return [...groups.entries()];
};

/**
 * Payment page: booking summary and payment method choice. All gateway communication happens in the
 * backend (backend/services/payment.service.js).
 *   - Sandbox simulation (PAYMENT_SIMULATION=true): POST /api/payments/:orderId/simulate
 *   - Real gateway: the customer is sent to the hosted payment page the backend returned.
 */
export function PaymentView({ payment }: { payment: PaymentSession }) {
  const { t, formatDate, formatDateTime } = useI18n();
  const router = useRouter();
  const showToast = useToast();
  const { booking } = payment;
  const groups = groupMethods(payment.methods);
  const [method, setMethod] = useState(groups.find(([group]) => group === 'Virtual Account')?.[1][0]?.id ?? payment.methods[0]?.id ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (payment.simulated) {
        await api.payments.simulate(payment.orderId, method);
      } else if (payment.redirectUrl) {
        // Real gateway: the gateway sends the customer back to the success page afterwards.
        window.location.href = payment.redirectUrl;
        return;
      }

      router.push(routes.bookingSuccess({ code: booking.code, order: payment.orderId }));
    } catch (error) {
      setSubmitting(false);
      showToast(error instanceof Error ? error.message : String(error), 'error');
    }
  };

  return (
    <>
      <Breadcrumb trail={[{ label: t('payment.title') }]} />
      <h1 className="checkout__title">{t('payment.title')}</h1>
      <p className="checkout__lead">{t('payment.lead')}</p>

      {payment.simulated && (
        <div className="alert alert--info checkout__alert">
          <Icon name="info" size={18} />
          <span>{t('payment.sandboxNotice')}</span>
        </div>
      )}

      <div className="checkout">
        <form className="checkout__methods" onSubmit={handleSubmit}>
          <h2 className="checkout__heading">{t('payment.method')}</h2>
          {groups.map(([group, items]) => (
            <fieldset className="method-group" key={group}>
              <legend className="method-group__title">{group}</legend>
              {items.map((item) => (
                <label className="method" key={item.id}>
                  <input type="radio" name="method" value={item.id} checked={method === item.id} onChange={() => setMethod(item.id)} />
                  <span className="method__body">
                    <Icon name={METHOD_ICONS[group] ?? 'credit-card'} size={20} />
                    <span>{item.label}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          ))}
          <SubmitButton size="lg" block loading={submitting}>
            <Icon name="lock" size={18} />
            {t('payment.pay', { amount: formatRupiah(payment.amount) })}
          </SubmitButton>
        </form>

        <BookingSummary
          image={booking.packageImage}
          title={booking.packageTitle}
          rows={[
            { label: t('payment.bookingCode'), value: booking.code },
            { label: t('payment.traveller'), value: booking.customerName },
            { label: t('booking.date'), value: formatDate(booking.travelDate) },
            { label: t('booking.guests'), value: booking.guests },
          ]}
          total={{ label: t('booking.total'), value: formatRupiah(payment.amount) }}
          note={<><Icon name="bell" size={14} />{t('payment.expires', { time: formatDateTime(payment.expiresAt) })}</>}
        />
      </div>
    </>
  );
}
