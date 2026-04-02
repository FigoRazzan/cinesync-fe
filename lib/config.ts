export const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
  appName: 'CineSync',
};

export const routeConfig = {
  login: '/login',
  register: '/register',
  userDashboard: '/user',
  producerDashboard: '/producer',
  adminDashboard: '/admin',
};
