import { SectionTitle } from '@fixora/ui';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center gap-4 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Fixora SaaS</p>
      <SectionTitle>Service Business Operating System</SectionTitle>
      <p className="max-w-xl text-gray-700">
        Monorepo foundation ready: Next.js web, Expo mobile, and NestJS API with shared UI and shared types.
      </p>
    </main>
  );
}
