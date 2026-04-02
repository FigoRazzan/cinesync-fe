import Link from 'next/link';
import { api } from '@/lib/api';
import { routeConfig } from '@/lib/config';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const catalog = await api.getCatalog().catch(() => []);
  const trendingMovies = await api.getTrendingMovies().catch(() => []);
  const featuredMovie = trendingMovies[0];
  const posterRail = trendingMovies.filter((movie) => movie.posterUrl).slice(0, 12);
  const movingPosters = [...posterRail, ...posterRail];

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#09090d] dark:text-white">
      <section
        className="relative overflow-hidden border-b border-zinc-800/80"
        style={{
          backgroundImage: featuredMovie?.backdropUrl
            ? `linear-gradient(to top, rgba(9,9,13,1), rgba(9,9,13,0.65), rgba(9,9,13,0.9)), url(${featuredMovie.backdropUrl})`
            : 'linear-gradient(to top, rgba(9,9,13,1), rgba(9,9,13,0.65), rgba(9,9,13,0.9))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
          <h1 className="text-3xl font-black tracking-[0.2em] text-red-500">CINESYNC</h1>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              className="rounded border border-zinc-200/30 bg-gray-100 dark:bg-zinc-900/40 px-4 py-2 text-sm hover:border-zinc-200/70"
              href={routeConfig.register}
            >
              Register
            </Link>
            <Link
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
              href={routeConfig.login}
            >
              Login
            </Link>
          </nav>
        </header>

        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-20 pt-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">Now Premiering</p>
            <h2 className="mt-4 text-5xl font-extrabold leading-tight md:text-6xl">
              {featuredMovie?.title ?? 'Netflix-Style Streaming Experience'}
            </h2>
            <p className="mt-5 max-w-2xl text-gray-800 dark:text-gray-700 dark:text-zinc-200/90">
              {featuredMovie?.overview ||
                'Nonton film trending, kelola kontrak producer, dan monitor platform dari dashboard role-based yang clean.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link className="rounded bg-black dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-zinc-200" href={routeConfig.login}>
                ▶ Watch Now
              </Link>
              <Link
                className="rounded border border-gray-300 dark:border-zinc-300/30 bg-gray-200 dark:bg-zinc-800/50 px-6 py-3 text-sm font-semibold text-black dark:text-white hover:border-zinc-200"
                href={routeConfig.register}
              >
                Join Membership
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-gray-200 dark:border-zinc-700/60 bg-white/80 dark:bg-black/45 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold">Kenapa CineSync?</h3>
            <ul className="mt-4 space-y-3 text-gray-700 dark:text-zinc-200">
              <li>• UI cinematic ala Netflix</li>
              <li>• Streaming + subscription end-to-end</li>
              <li>• Producer contract workflow otomatis</li>
              <li>• Admin moderation dashboard terpusat</li>
            </ul>
          </aside>
        </div>

        <div className="poster-marquee-wrapper pb-12">
          {movingPosters.length === 0 ? (
            <p className="mx-auto w-full max-w-7xl px-6 text-sm text-gray-600 dark:text-zinc-400">
              Belum ada poster trending. Cek koneksi TMDB API.
            </p>
          ) : (
            <div className="poster-marquee-track">
              {movingPosters.map((movie, index) => (
                <div key={`${movie.tmdbId}-${index}`} className="poster-card">
                  <img alt={movie.title} src={movie.posterUrl ?? ''} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-14">
        <h3 className="mb-4 text-2xl font-semibold">Trending dari TMDB</h3>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trendingMovies.length === 0 ? (
            <article className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 text-gray-600 dark:text-zinc-400">
              TMDB belum terhubung. Isi TMDB API key di backend .env lalu refresh.
            </article>
          ) : (
            trendingMovies.map((movie) => (
              <article key={movie.tmdbId} className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-4">
                <h4 className="line-clamp-1 text-lg font-semibold">{movie.title}</h4>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-zinc-400">{movie.overview || 'Deskripsi belum tersedia.'}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-red-400">Rating {movie.rating.toFixed(1)}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-14">
        <h3 className="mb-4 text-2xl font-semibold">Now Streaming (Kontrak Aktif Internal)</h3>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {catalog.length === 0 ? (
            <article className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 text-gray-600 dark:text-zinc-400">
              Belum ada katalog aktif. Producer bisa mulai ajukan kontrak dari dashboard.
            </article>
          ) : (
            catalog.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-4">
                <h4 className="line-clamp-1 text-lg font-semibold">{item.movie.title}</h4>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-zinc-400">{item.movie.overview ?? 'Deskripsi belum tersedia.'}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-red-400">Status {item.status}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
