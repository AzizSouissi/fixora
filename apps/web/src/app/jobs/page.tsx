export default function JobsFeaturePage() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl items-center px-6 py-10 md:px-10">
      <section className="hero-card w-full rounded-3xl p-7 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong">
          Feature Placeholder
        </p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Jobs Create/Update Flow</h1>
        <p className="mt-3 text-sm text-muted">
          This route is the redirection target after login. Next implementation step will add customer CRUD,
          job lifecycle states, assignment, and validation backed by tenant-aware auth.
        </p>
      </section>
    </main>
  );
}
