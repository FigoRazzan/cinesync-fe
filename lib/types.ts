export type AppRole = 'ADMIN' | 'PRODUCER' | 'USER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description?: string;
  price: string;
  durationDays: number;
}

export interface ContractCatalogItem {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  movie: {
    id: string;
    title: string;
    overview?: string;
    posterPath?: string;
    backdropPath?: string;
  };
}

export interface TmdbMovie {
  tmdbId: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  rating: number;
}
