import { useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { MaskText } from '../motion/MaskText';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { EASE, rise, stagger, VIEWPORT } from '../../motion/language';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../../data/siteContent';

type Status = 'idle' | 'loading' | 'success' | 'error';

/** One row of the slate: the label sits in its own cell, the field fills the rest. */
const SlateRow = ({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  multiline,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  multiline?: boolean;
}) => {
  const field =
    'w-full bg-transparent text-[1.08rem] text-ivory placeholder:text-ivory/25 focus:outline-none';
  return (
    <label className="group grid cursor-text grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-4 border-b border-ivory/20 px-4 py-4 transition-colors duration-300 focus-within:bg-champagne/[0.07] md:grid-cols-[8rem_minmax(0,1fr)] md:px-6 md:py-5">
      <span className="pt-0.5 font-display text-[1.15rem] italic text-mute transition-colors duration-300 group-focus-within:text-champagne">
        {label}
        {required && <span aria-hidden className="text-champagne"> *</span>}
      </span>
      {multiline ? (
        <textarea name={name} required={required} rows={5} placeholder={placeholder} className={`${field} resize-none`} />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} className={field} />
      )}
    </label>
  );
};

const Office = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div variants={rise} className="border-t border-ivory/20 pt-5">
    <p className="font-title text-[2rem] font-extrabold uppercase leading-none text-champagne">{title}</p>
    <p className="mt-3 font-display text-lg italic text-mute">SRHP Films</p>
    {children}
  </motion.div>
);

export const ContactSection = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const slateRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* the clapper arm drops and snaps shut as the slate arrives */
  const arm = useScrollProgress(slateRef, ['start 0.95', 'start 0.5']);
  const armAngle = useSpring(useTransform(arm, [0, 1], [-17, 0]), { stiffness: 300, damping: 15, mass: 0.6 });

  const reset = (ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), ms);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading') return;
    setErrorMsg('');
    setStatus('loading');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      subject: fd.get('subject') as string,
      message: fd.get('message') as string,
    };

    try {
      // Sent via a small serverless function (/api/contact) backed by Resend — see api/contact.js
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => null);
      // Success is only ever shown when the server explicitly confirms it.
      if (!res.ok || result?.success !== true) {
        throw new Error(result?.message || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      formRef.current?.reset();
      reset(6000);
    } catch (err) {
      setErrorMsg(err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
      reset(5000);
    }
  };

  const label =
    status === 'loading' ? 'Sending…' : status === 'success' ? '✓ Message Received' : status === 'error' ? 'Try Again' : 'Send Message';

  return (
    <section id="contact" className="grain relative bg-ink pb-28 pt-8 md:pt-12">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 0%, rgb(var(--c-champagne) / 0.12), transparent 70%), radial-gradient(45% 45% at 100% 100%, rgb(var(--c-oxblood) / 0.14), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 md:px-12">
        <header className="mb-14 md:mb-20">
          <MaskText
            as="h2"
            text="Start a Project"
            className="block font-title text-[clamp(4rem,14.5vw,14rem)] font-black uppercase leading-[0.84] text-ivory"
          />
          <motion.p
            className="mt-6 flex items-center gap-4 font-display text-xl italic text-champagne md:text-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span aria-hidden className="h-px w-12 bg-champagne" />
            Available for Collaboration
          </motion.p>
        </header>

        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,4.5fr)_minmax(0,7.5fr)] lg:gap-20">
          {/* ── Locations ── */}
          <motion.div variants={stagger(0.12, 0.1)} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="order-2 flex flex-col gap-10 lg:order-1">
            <Office title="United States">
              <address className="mt-2 text-[1.05rem] not-italic leading-relaxed text-ivory/90">
                132 N Belair Rd
                <br />
                Evans, GA 30809
                <br />
                USA
              </address>
            </Office>

            <Office title="India">
              <address className="mt-2 text-[1.05rem] not-italic leading-relaxed text-ivory/90">
                2nd Floor, Vaswani Chambers
                <br />
                Dr Annie Besant Rd
                <br />
                Worli, Sivaji Nagar
                <br />
                Mumbai – 400030
                <br />
                Maharashtra, India
              </address>
            </Office>

            <motion.div variants={rise} className="border-t border-ivory/20 pt-5">
              <p className="font-title text-[2rem] font-extrabold uppercase leading-none text-champagne">Contact Us</p>
              <div className="mt-4 flex flex-col gap-2">
                <a href={`mailto:${CONTACT_EMAIL}`} className="group w-fit break-all font-display text-[1.5rem] text-ivory transition-colors hover:text-champagne md:text-[1.8rem]">
                  <span className="draw-underline pb-0.5">{CONTACT_EMAIL}</span>
                </a>
                <a href={CONTACT_PHONE_HREF} className="group w-fit font-display text-[1.5rem] text-ivory transition-colors hover:text-champagne md:text-[1.8rem]">
                  <span className="draw-underline pb-0.5">{CONTACT_PHONE}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* ── The slate ── */}
          <div ref={slateRef} className="order-1 pt-16 md:pt-24 lg:order-2">
            {/* clapper arm: hinged at the left, drops shut */}
            <motion.div
              aria-hidden
              className="slate-stripes relative z-10 -mb-px h-9 border border-ivory/30 md:h-11"
              style={{ rotate: armAngle, transformOrigin: '0% 100%' }}
            />
            <div aria-hidden className="slate-stripes-rev h-9 border border-t-0 border-ivory/30 md:h-11" />

            <div className="border border-t-0 border-ivory/30 bg-midnight/85 backdrop-blur-sm">
              <div className="grid grid-cols-2 border-b border-ivory/20">
                <div className="border-r border-ivory/20 px-4 py-4 md:px-6">
                  <p className="font-display text-[1.05rem] italic text-mute">Production</p>
                  <p className="mt-1 font-title text-[1.8rem] font-extrabold uppercase leading-none text-ivory md:text-[2.2rem]">SRHP Films</p>
                </div>
                <div className="px-4 py-4 md:px-6">
                  <p className="font-display text-[1.05rem] italic text-mute">Director</p>
                  <p className="mt-1 font-title text-[1.8rem] font-extrabold uppercase leading-none text-ivory md:text-[2.2rem]">Sandip Patel</p>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
                <SlateRow label="Name" name="name" placeholder="Your name" required />
                <SlateRow label="Email" name="email" type="email" placeholder="email@example.com" required />
                <SlateRow label="Phone" name="phone" type="tel" placeholder="+1 (000) 000-0000" />
                <SlateRow label="Subject" name="subject" placeholder="Inquiry regarding…" required />
                <SlateRow label="Message" name="message" placeholder="Your vision…" required multiline />

                <div aria-live="polite" className="min-h-[2.75rem] px-4 pt-4 md:px-6">
                  <AnimatePresence mode="wait">
                    {status === 'error' && (
                      <motion.p key="e" role="alert" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[1rem] text-[#E58A8F]">
                        {errorMsg}
                      </motion.p>
                    )}
                    {status === 'success' && (
                      <motion.p key="s" role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-display text-[1.2rem] italic text-champagne">
                        Thank you. The director will be in touch shortly.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`group relative block w-full overflow-hidden py-5 font-title text-[1.6rem] font-extrabold uppercase tracking-[0.04em] transition-colors duration-500 disabled:cursor-wait md:text-[1.9rem] ${
                    status === 'success' ? 'bg-sage text-ink' : 'bg-champagne text-ink hover:bg-ivory'
                  }`}
                >
                  {/* film-leader sweep while the message is in transit */}
                  {status === 'loading' && (
                    <motion.span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[4px] w-1/3 bg-ink/70"
                      initial={{ x: '-100%' }}
                      animate={{ x: '300%' }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  <motion.span layout transition={{ ease: EASE.out }} className="relative">
                    {label}
                  </motion.span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
