import { AuthPanel } from '../../components/auth-panel';

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-4xl items-center px-6 py-10 md:px-10">
      <section className="hero-card entry-rise mx-auto w-full max-w-xl rounded-3xl p-7 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong">
          Secure Access
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Login</h1>
        <p className="mt-3 text-sm text-muted">
          Authenticate with tenant credentials to access dispatch and job workflows.
        </p>
        <div className="mt-5">
          <AuthPanel />
        </div>
      </section>
    </main>
  );
}
