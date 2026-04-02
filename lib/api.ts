import { appConfig } from './config';
import type {
  ContractCatalogItem,
  LoginResponse,
  Plan,
  TmdbMovie,
  UserProfile,
} from './types';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request gagal: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'PRODUCER';
  }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: (token: string) =>
    request<UserProfile>('/auth/profile', {
      token,
    }),

  getCatalog: () => request<ContractCatalogItem[]>('/contracts/catalog'),

  getTrendingMovies: () => request<TmdbMovie[]>('/movies/trending'),

  searchMovies: (query: string) =>
    request<TmdbMovie[]>(`/movies/search?q=${encodeURIComponent(query)}`),

  getPlans: () => request<Plan[]>('/subscriptions/plans'),

  subscribe: (token: string, planId: string) =>
    request('/subscriptions/subscribe', {
      method: 'POST',
      token,
      body: JSON.stringify({ planId }),
    }),

  getMySubscription: (token: string) =>
    request('/subscriptions/me', {
      token,
    }),

  getProducerContracts: (token: string) =>
    request('/contracts/my', {
      token,
    }),

  createProducerContract: (
    token: string,
    payload: {
      movieTitle: string;
      movieOverview?: string;
      posterPath?: string;
      startDate: string;
      endDate: string;
      producerShare: number;
      notes?: string;
    },
  ) =>
    request('/contracts', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    }),

  getPendingContracts: (token: string) =>
    request('/contracts/pending', {
      token,
    }),

  reviewContract: (
    token: string,
    contractId: string,
    payload: { status: 'ACTIVE' | 'REJECTED'; notes?: string },
  ) =>
    request(`/contracts/${contractId}/review`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    }),
};
