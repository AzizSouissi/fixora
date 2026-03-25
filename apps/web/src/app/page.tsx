import { SectionTitle } from '@fixora/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl items-center px-6 py-10 md:px-10">
      <section className="hero-card entry-rise w-full rounded-3xl p-7 md:p-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong">
          Field Service Platform
        </p>
        <SectionTitle className="mt-3 text-4xl leading-tight md:text-6xl">
          Built for the crews that keep cities running.
        </SectionTitle>
        <p className="entry-rise-delay mt-5 max-w-2xl text-base text-muted md:text-lg">
          Fixora gives plumbing, electrical, and maintenance teams a polished operating system for
          dispatch, job execution, and revenue tracking across web and mobile.
        </p>

        <div className="entry-rise-delay mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-outline bg-white/75 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Dispatch</p>
            <p className="mt-2 text-sm text-muted">Schedule jobs, route technicians, and avoid overlaps.</p>
          </div>
          <div className="rounded-2xl border border-outline bg-white/75 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Jobs</p>
            <p className="mt-2 text-sm text-muted">Track status, notes, and checklists in real time.</p>
          </div>
          <div className="rounded-2xl border border-outline bg-white/75 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Billing</p>
            <p className="mt-2 text-sm text-muted">Move from estimate to paid invoice with fewer clicks.</p>
          </div>
        </div>

        <div className="entry-rise-delay mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Go To Login
          </Link>
          <span className="text-sm text-muted">Next after login: dashboard and jobs workflow.</span>
        </div>
      </section>
    </main>
  );
}
