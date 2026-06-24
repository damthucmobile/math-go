
export const ROUTES = {
  HOME: '/',
  CONTACT: '/contact',
  COURSES: '/courses',
  PAGES: '/pages',
  POSTS: '/posts',
  REGISTER: '/register',
  TESTIMONIALS: '/testimonials',
  TUTORS: '/tutors',
} as const

export const ROUTE_BUILDERS = {
  CURRICULUM_BY_SLUG: (slug: string): string => `/curriculum/${slug}`,
  PAGES_BY_SLUG: (slug: string): string => `/pages/${slug}`,
  POSTS_BY_ID: (id: string): string => `/posts/${id}`,
} as const
