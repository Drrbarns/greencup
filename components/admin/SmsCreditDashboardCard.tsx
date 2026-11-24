import Link from 'next/link';
import type { DashboardSmsCredit } from '@/lib/sms-credit-types';

type Props = {
  smsCredit: DashboardSmsCredit;
  buySmsHref?: string;
};

export function SmsCreditDashboardCard({ smsCredit, buySmsHref }: Props) {
  const blinkLow = smsCredit.status === 'ok' && smsCredit.level === 'low';
  const blinkEmpty = smsCredit.status === 'ok' && smsCredit.level === 'empty';

  const borderClass =
    smsCredit.status === 'ok' && smsCredit.level === 'empty'
      ? 'border-red-300'
      : smsCredit.status === 'ok' && smsCredit.level === 'low'
        ? 'border-amber-300'
        : 'border-gray-200';

  const iconBg =
    smsCredit.status === 'ok' && smsCredit.level === 'empty'
      ? 'bg-red-100 text-red-700'
      : smsCredit.status === 'ok' && smsCredit.level === 'low'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-store-primary/15 text-store-primary';

  const showTopUp = Boolean(buySmsHref) && smsCredit.status !== 'not_connected';

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${borderClass} ${
        blinkEmpty ? 'sms-credit-double-blink-empty' : blinkLow ? 'sms-credit-double-blink' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-medium text-gray-900">SMS credit</h3>
        {showTopUp ? (
          <Link
            href={buySmsHref!}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors shrink-0"
          >
            Top up
          </Link>
        ) : null}
      </div>

      {smsCredit.status === 'not_connected' ? (
        <p className="text-base font-semibold text-gray-800">SMS is not connected</p>
      ) : smsCredit.status === 'load_failed' ? (
        <p className="text-base font-semibold text-gray-800">The balance could not be loaded</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold tabular-nums ${
                smsCredit.level === 'empty' ? 'text-red-700' : smsCredit.level === 'low' ? 'text-amber-700' : 'text-gray-900'
              }`}
            >
              {smsCredit.sms_left.toLocaleString('en-GH')}
            </span>
            <span className="text-sm text-gray-600">texts left</span>
          </div>
          {smsCredit.level === 'low' ? (
            <p className="mt-2 text-sm font-medium text-amber-700">Running low, top up soon</p>
          ) : null}
          {smsCredit.level === 'empty' ? (
            <p className="mt-2 text-sm font-medium text-red-700">SMS credit is empty, texts are not being sent</p>
          ) : null}
        </>
      )}

      <div className={`w-12 h-12 mt-4 flex items-center justify-center rounded-lg ${iconBg}`} aria-hidden>
        <i className="ri-message-2-line text-2xl" />
      </div>
    </div>
  );
}