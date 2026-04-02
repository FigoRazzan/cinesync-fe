'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import type { Plan, UserProfile } from '@/lib/types';

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      const token = authStorage.getToken();
      if (!token) {
        setError('Silakan login terlebih dahulu.');
        return;
      }

      try {
        const [me, availablePlans] = await Promise.all([
          api.getProfile(token),
          api.getPlans(),
        ]);

        setProfile(me);
        setPlans(availablePlans);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat dashboard user');
      }
    };

    void run();
  }, []);

  const subscribe = async (planId: string) => {
    const token = authStorage.getToken();
    if (!token) {
      setError('Token login tidak ditemukan');
      return;
    }

    try {
      await api.subscribe(token, planId);
      setMessage('Langganan berhasil diaktifkan.');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal berlangganan');
      setMessage('');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-zinc-100">
      <h1 className="text-3xl font-bold">Dashboard User</h1>
      {profile && <p className="mt-2 text-zinc-400">Halo, {profile.name}</p>}

      {error && <p className="mt-4 rounded bg-red-950/70 p-3 text-red-300">{error}</p>}
      {message && <p className="mt-4 rounded bg-emerald-950/70 p-3 text-emerald-300">{message}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Pilih Paket Langganan</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-zinc-400">{plan.description}</p>
              <p className="mt-3 text-2xl font-bold">Rp{Number(plan.price).toLocaleString('id-ID')}</p>
              <button
                className="mt-4 w-full rounded bg-red-600 px-3 py-2 font-medium hover:bg-red-500"
                onClick={() => subscribe(plan.id)}
                type="button"
              >
                Subscribe
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
