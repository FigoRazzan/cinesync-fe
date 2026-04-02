'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';

interface PendingContract {
  id: string;
  status: string;
  producerShare: string;
  platformShare: string;
  movie: {
    title: string;
  };
  producer: {
    name: string;
    email: string;
  };
}

export default function AdminDashboardPage() {
  const [contracts, setContracts] = useState<PendingContract[]>([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    const token = authStorage.getToken();
    if (!token) {
      setError('Silakan login sebagai admin.');
      return;
    }

    try {
      const data = await api.getPendingContracts(token);
      setContracts(data as PendingContract[]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat dashboard admin');
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const review = async (contractId: string, status: 'ACTIVE' | 'REJECTED') => {
    const token = authStorage.getToken();
    if (!token) {
      setError('Token login tidak ditemukan');
      return;
    }

    try {
      await api.reviewContract(token, contractId, { status });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aksi review gagal');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-zinc-100">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>
      <p className="mt-2 text-zinc-400">Monitoring kontrak producer dan validasi tayang.</p>

      {error && <p className="mt-4 rounded bg-red-950/70 p-3 text-red-300">{error}</p>}

      <section className="mt-8 space-y-3">
        {contracts.map((contract) => (
          <article key={contract.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-lg font-semibold">{contract.movie.title}</h2>
            <p className="text-sm text-zinc-400">Producer: {contract.producer.name}</p>
            <p className="text-sm text-zinc-400">Share Producer: {contract.producerShare}%</p>
            <div className="mt-3 flex gap-2">
              <button
                className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
                onClick={() => review(contract.id, 'ACTIVE')}
                type="button"
              >
                Approve
              </button>
              <button
                className="rounded bg-red-700 px-3 py-2 text-sm font-medium hover:bg-red-600"
                onClick={() => review(contract.id, 'REJECTED')}
                type="button"
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
