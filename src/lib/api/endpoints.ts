export const API_ENDPOINTS = {
  auth: {
    login: '/auth/sign_in',
    register: '/auth',
    logout: '/auth/sign_out',
    me: '/auth/me',
  },
  lineages: '/lineages',
  persons: '/persons',
  relationships: '/relationships',
  events: '/events',
  media: '/media',
  lunar: '/lunar/convert',
} as const;
