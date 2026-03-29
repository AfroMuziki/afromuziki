// frontend/src/utils/queryKeys.ts
export const queryKeys = {
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
  content: {
    all: ['content'],
    detail: (id: string) => ['content', 'detail', id],
    list: (params: any) => ['content', 'list', params],
    infinite: (params: any) => ['content', 'infinite', params],
    trending: (limit: number) => ['content', 'trending', limit],
    newReleases: (limit: number) => ['content', 'newReleases', limit],
    browse: (params: any) => ['content', 'browse', params],
  },
  artist: {
    all: ['artist'],
    profile: (id: string) => ['artist', 'profile', id],
    byUsername: (username: string) => ['artist', 'username', username],
    content: (artistId: string) => ['artist', 'content', artistId],
    stats: (artistId: string) => ['artist', 'stats', artistId],
    analytics: (artistId: string, period: string) => ['artist', 'analytics', artistId, period],
    followers: (artistId: string, page: number) => ['artist', 'followers', artistId, page],
    activity: (artistId: string) => ['artist', 'activity', artistId],
  },
  engagement: {
    all: ['engagement'],
    likes: (contentId: string) => ['engagement', 'likes', contentId],
    comments: (contentId: string, page?: number) => ['engagement', 'comments', contentId, page],
    follows: (artistId: string) => ['engagement', 'follows', artistId],
  },
  search: {
    results: (query: string, params: any) => ['search', 'results', query, params],
    suggestions: (query: string) => ['search', 'suggestions', query],
  },
  admin: {
    stats: ['admin', 'stats'],
    analytics: (period: string) => ['admin', 'analytics', period],
    users: (page?: number, search?: string) => ['admin', 'users', page, search],
    content: (page?: number, status?: string) => ['admin', 'content', page, status],
    moderation: ['admin', 'moderation'],
    reports: (page?: number, status?: string) => ['admin', 'reports', page, status],
  },
};
