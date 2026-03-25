'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AuthUser } from '@fixora/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const accessToken = localStorage.getItem('fixora.accessToken');
      const tenantId = localStorage.getItem('fixora.tenantId');

      if (!accessToken || !tenantId) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
            'x-tenant-id': tenantId,
          },
        });

        if (!response.ok) {
          throw new Error('Session expired. Please log in again.');
        }

        const profile = (await response.json()) as AuthUser;
        setUser(profile);
      } catch (loadError) {
        localStorage.removeItem('fixora.accessToken');
        localStorage.removeItem('fixora.refreshToken');
        localStorage.removeItem('fixora.tenantId');
        setError(loadError instanceof Error ? loadError.message : 'Unable to load session');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [router]);

  const logout = async () => {
    const accessToken = localStorage.getItem('fixora.accessToken');
    const tenantId = localStorage.getItem('fixora.tenantId');

    try {
      if (accessToken && tenantId) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${accessToken}`,
            'x-tenant-id': tenantId,
          },
        });
      }
    } finally {
      localStorage.removeItem('fixora.accessToken');
      localStorage.removeItem('fixora.refreshToken');
      localStorage.removeItem('fixora.tenantId');
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <main className="mx-auto grid min-h-screen w-full max-w-4xl place-items-center px-6 py-10">
        <p className="text-muted">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl items-center px-6 py-10 md:px-10">
      <section className="hero-card w-full rounded-3xl p-7 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-strong">
          Authenticated Area
        </p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Dashboard</h1>
        <p className="mt-3 text-sm text-muted">
          {user
            ? `Welcome ${user.name} (${user.role}) from ${user.tenantId}.`
            : 'No active user loaded.'}
        </p>

        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-8 rounded-2xl border border-outline bg-white/75 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Next Feature</p>
          <p className="mt-2 text-sm text-muted">
            Continue to jobs flow implementation: create/update lifecycle, assignment, and status transitions.
          </p>
          <Link
            href="/jobs"
            className="mt-4 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Go To Jobs Feature
          </Link>
        </div>

        <button
          type="button"
          className="mt-5 rounded-xl border border-outline bg-white/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-white"
          onClick={logout}
        >
          Log Out
        </button>
      </section>
    </main>
  );
}
