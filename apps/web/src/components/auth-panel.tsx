'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '@fixora/types';

type AuthState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; user: AuthUser };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function AuthPanel() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState('tenant-acme');
  const [email, setEmail] = useState('owner@acme.fixora.local');
  const [password, setPassword] = useState('Passw0rd!');
  const [state, setState] = useState<AuthState>({ status: 'idle' });
  const [notice, setNotice] = useState<string | null>(null);

  const helpText = useMemo(
    () =>
      'Seed users: owner@acme.fixora.local, dispatch@acme.fixora.local, tech@zen.fixora.local (Passw0rd!)',
    [],
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: 'loading' });
    setNotice(null);

    const payload: LoginRequest = { tenantId, email, password };

    try {
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!loginResponse.ok) {
        const reason = await loginResponse.text();
        throw new Error(reason || 'Login failed');
      }

      const loginData = (await loginResponse.json()) as LoginResponse;
      localStorage.setItem('fixora.accessToken', loginData.accessToken);
      localStorage.setItem('fixora.refreshToken', loginData.refreshToken);
      localStorage.setItem('fixora.tenantId', loginData.user.tenantId);

      const meResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          authorization: `Bearer ${loginData.accessToken}`,
          'x-tenant-id': loginData.user.tenantId,
        },
      });

      if (!meResponse.ok) {
        const reason = await meResponse.text();
        throw new Error(reason || 'Failed to load profile');
      }

      const profile = (await meResponse.json()) as AuthUser;
      setState({ status: 'success', user: profile });
      setNotice('Signed in successfully. Redirecting...');
      window.sessionStorage.setItem('fixora.loggedIn', 'true');
      router.replace('/dashboard');
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unexpected auth error',
      });
    }
  };

  return (
    <aside className="hero-card entry-rise-delay w-full rounded-3xl p-6 md:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Tenant Login</p>
      <h3 className="mt-2 text-2xl font-bold">Sign In To Continue</h3>
      <p className="mt-2 text-sm text-muted">{helpText}</p>

      <form onSubmit={submit} className="mt-5 grid gap-3">
        <label className="grid gap-1 text-sm font-medium">
          Tenant ID
          <input
            className="rounded-xl border border-outline bg-white/90 px-3 py-2 outline-none ring-brand/30 transition focus:ring"
            value={tenantId}
            onChange={(event) => setTenantId(event.target.value)}
            autoComplete="organization"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Email
          <input
            className="rounded-xl border border-outline bg-white/90 px-3 py-2 outline-none ring-brand/30 transition focus:ring"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Password
          <input
            className="rounded-xl border border-outline bg-white/90 px-3 py-2 outline-none ring-brand/30 transition focus:ring"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong disabled:opacity-50"
          disabled={state.status === 'loading'}
        >
          {state.status === 'loading' ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {notice ? (
        <p className="mt-3 rounded-xl border border-outline bg-white/75 px-3 py-2 text-sm text-muted">
          {notice}
        </p>
      ) : null}

      {state.status === 'error' ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      {state.status === 'success' ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Signed in as {state.user.name} ({state.user.role}) in {state.user.tenantId}
        </div>
      ) : null}
    </aside>
  );
}
