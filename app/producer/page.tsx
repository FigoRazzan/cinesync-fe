'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { authStorage } from '@/lib/auth';

interface ProducerContract {
  id: string;
  status: string;
  producerShare: string;
  startDate: string;
  endDate: string;
  movie: {
    title: string;
  };
}

export default function ProducerDashboardPage() {
  const [contracts, setContracts] = useState<ProducerContract[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [movieTitle, setMovieTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [producerShare, setProducerShare] = useState(60);

  const loadContracts = async () => {
    const token = authStorage.getToken();
    if (!token) {
      setError('Silakan login sebagai producer.');
      return;
    }

    try {
      const data = await api.getProducerContracts(token);
      setContracts(data as ProducerContract[]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat kontrak producer');
    }
  };

  useEffect(() => {
    void loadContracts();
  }, []);

  const submitContract = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = authStorage.getToken();
    if (!token) {
      setError('Silakan login sebagai producer.');
      return;
    }

    try {
      await api.createProducerContract(token, {
        movieTitle,
        startDate,
        endDate,
        producerShare,
      });
      setMessage('Pengajuan kontrak berhasil dibuat.');
      setMovieTitle('');
      setStartDate('');
      setEndDate('');
      await loadContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat kontrak');
      setMessage('');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-zinc-100">
      <h1 className="text-3xl font-bold">Dashboard Producer</h1>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">Generate Kontrak Penayangan</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitContract}>
          <input
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            placeholder="Judul Film"
            value={movieTitle}
            onChange={(event) => setMovieTitle(event.target.value)}
            required
          />
          <input
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            type="number"
            min={1}
            max={99}
            value={producerShare}
            onChange={(event) => setProducerShare(Number(event.target.value))}
            required
          />
          <input
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
          />
          <input
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
          />
          <button className="rounded bg-red-600 px-4 py-2 font-semibold hover:bg-red-500 md:col-span-2" type="submit">
            Kirim Pengajuan
          </button>
        </form>
      </section>

      {error && <p className="mt-4 rounded bg-red-950/70 p-3 text-red-300">{error}</p>}
      {message && <p className="mt-4 rounded bg-emerald-950/70 p-3 text-emerald-300">{message}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Daftar Kontrak Saya</h2>
        <div className="mt-3 space-y-3">
          {contracts.map((contract) => (
            <article key={contract.id} className="rounded border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="font-semibold">{contract.movie.title}</h3>
              <p className="text-sm text-zinc-400">Status: {contract.status}</p>
              <p className="text-sm text-zinc-400">
                Periode: {new Date(contract.startDate).toLocaleDateString('id-ID')} -{' '}
                {new Date(contract.endDate).toLocaleDateString('id-ID')}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
