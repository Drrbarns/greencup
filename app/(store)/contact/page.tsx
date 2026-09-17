"use client";

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCMS } from '@/context/CMSContext';
import PageHero from '@/components/PageHero';
import { usePageTitle } from '@/hooks/usePageTitle';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import {
  CONTACT_ADDRESS,
  CONTACT_PHONE,
  HERO_IMAGES,
  SUPPORT_EMAIL,
  WHATSAPP_LINK,
} from '@/lib/brand';

const FIELD =
  'w-full rounded-2xl border border-brand-nude bg-brand-cream/50 px-4 py-3.5 text-sm text-brand-espresso placeholder:text-brand-cocoa/35 focus:border-brand-champagne focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-champagne/25';

const FAQS = [
  {
    question: 'How long does delivery take?',
    answer:
      'Accra and nearby areas are usually 1–2 business days. Other regions in Ghana take about 2–5 days by rider or bus. Confirm a Spintex pickup if you want to collect the same day.',
  },
  {
    question: 'Can I pick up my order?',
    answer:
      'Yes — at GCB Bank, White House, Spintex Road. This is a fulfillment point, not a walk-in shop. Message us first so the pack is ready.',
  },
  {
    question: 'Do you ship outside Ghana?',
    answer:
      'Not as a standard option yet. WhatsApp us for an international quote and we will tell you what is possible.',
  },
  {
    question: 'How do I pay?',
    answer:
      'Checkout is in Ghana Cedis. We take Mobile Money and card. You can also start an order on WhatsApp if you prefer to chat it through.',
  },
];

function ContactForm() {
  usePageTitle('Contact Us');
  const searchParams = useSearchParams();
  const { getSetting } = useCMS();
  const contactPhone = getSetting('contact_phone') || CONTACT_PHONE;
  const contactEmail = getSetting('contact_email') || SUPPORT_EMAIL;
  const contactAddress = getSetting('contact_address') || CONTACT_ADDRESS;
  const contactWhatsapp = getSetting('contact_whatsapp') || getSetting('contact_phone') || CONTACT_PHONE;
  const [openFaq, setOpenFaq] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { getToken, verifying } = useRecaptcha();

  useEffect(() => {
    const order = searchParams.get('order') || '';
    const subject = searchParams.get('subject') || '';
    if (!order && !subject) return;
    setFormData((prev) => ({
      ...prev,
      subject: subject || (order ? `Help with order ${order}` : prev.subject),
      message: order ? `Hi, I need help with order ${order}.\n\n` : prev.message,
    }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const isHuman = await getToken('contact');
    if (!isHuman) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          payload: formData,
        }),
      }).catch((err) => console.error('Contact notification error:', err));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        title="Get In Touch"
        subtitle="A question about a blend, an order, or a Spintex pickup — we will get back to you."
        backgroundImage={HERO_IMAGES[2]}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-4">
        <ContactInfoCards
          phone={contactPhone}
          email={contactEmail}
          address={contactAddress}
          whatsapp={contactWhatsapp}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 lg:gap-12 items-start">
          <div className="rounded-[2rem] border border-brand-nude/80 bg-white px-6 py-8 sm:px-9 sm:py-10 md:px-11 md:py-12 shadow-[0_1px_0_rgba(27,58,47,0.04)]">
            <span className="brand-eyebrow mb-3 block">Write to us</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] text-brand-espresso tracking-tight text-balance mb-3">
              Send a message
            </h2>
            <div className="w-12 h-px bg-brand-champagne mb-5" />
            <p className="brand-body mb-9 max-w-lg text-pretty">
              Tell us the blend, order number, or pickup time you need. We reply on WhatsApp or email, usually within a day.
            </p>

            <form id="contactForm" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold tracking-wide uppercase text-brand-cocoa/70 mb-2">
                    Full name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={FIELD}
                    placeholder="Ama Mensah"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-wide uppercase text-brand-cocoa/70 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={FIELD}
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold tracking-wide uppercase text-brand-cocoa/70 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={FIELD}
                    placeholder="055 555 5787"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold tracking-wide uppercase text-brand-cocoa/70 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={FIELD}
                    placeholder="Order, blend, or pickup"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold tracking-wide uppercase text-brand-cocoa/70 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={500}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${FIELD} resize-none min-h-[9.5rem]`}
                  placeholder="What can we help you brew or find?"
                />
                <p className="text-xs text-brand-cocoa/45 mt-2 tabular-nums">{formData.message.length}/500</p>
              </div>

              {submitStatus === 'success' && (
                <div className="rounded-2xl border border-brand-champagne/40 bg-[#EEF2E9] px-4 py-3.5 text-sm text-brand-espresso">
                  <i className="ri-check-line mr-2" aria-hidden />
                  Message sent. We will reply within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800">
                  <i className="ri-error-warning-line mr-2" aria-hidden />
                  Could not send. Try again, or WhatsApp us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || verifying}
                className="btn-luxury-primary w-full sm:w-auto justify-center px-10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || verifying ? (verifying ? 'Verifying…' : 'Sending…') : 'Send message'}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-brand-nude/80 bg-white px-6 py-8 sm:px-8 sm:py-10 shadow-[0_1px_0_rgba(27,58,47,0.04)]">
              <span className="brand-eyebrow mb-3 block">Before you write</span>
              <h2 className="font-display text-3xl sm:text-4xl text-brand-espresso tracking-tight text-balance mb-3">
                Quick answers
              </h2>
              <div className="w-12 h-px bg-brand-champagne mb-8" />

              <div className="divide-y divide-brand-nude/80">
                {FAQS.map((faq, index) => {
                  const open = openFaq === index;
                  return (
                    <div key={faq.question}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : index)}
                        className="flex w-full items-start gap-4 py-5 text-left"
                        aria-expanded={open}
                      >
                        <span className="mt-0.5 font-display text-sm tracking-[0.16em] text-brand-champagne">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 font-display text-lg text-brand-espresso leading-snug text-balance">
                          {faq.question}
                        </span>
                        <i
                          className={`${open ? 'ri-subtract-line' : 'ri-add-line'} mt-0.5 text-xl text-brand-espresso/50`}
                          aria-hidden
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      >
                        <div className="overflow-hidden">
                          <p className="brand-body pb-5 pl-11 pr-8 text-pretty">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-brand-espresso px-7 py-8 text-brand-cream">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-brand-champagne/10" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-champagne mb-3">Faster on chat</p>
              <h3 className="font-display text-2xl tracking-tight mb-3">Prefer WhatsApp?</h3>
              <p className="text-sm leading-relaxed text-brand-nude/90 mb-6 text-pretty">
                Blend questions and pickup times are often quicker there than the form.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-espresso hover:bg-brand-cream transition-colors"
              >
                <i className="ri-whatsapp-line text-lg" aria-hidden />
                Message Green Cup
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-brand-nude bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-brand-espresso tracking-tight mb-4">Need more help?</h2>
          <p className="brand-body mb-8 text-pretty">
            Include your order number or the blend name so we can answer in one reply.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/shop" className="btn-luxury-primary justify-center">
              Browse the range
            </Link>
            <Link href="/faqs" className="btn-luxury-outline justify-center">
              Read all FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center bg-brand-cream">
          <i className="ri-loader-4-line animate-spin text-3xl text-brand-espresso" />
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
}
