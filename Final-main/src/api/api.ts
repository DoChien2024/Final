export const API_CONFIG = {
  BASE_URL: 'https://dev-api-nurture.vinova.sg/api/v1',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
}

export const API_ENDPOINTS = {
  // Admin Auth
  ADMIN_LOGIN: '/admins/auth/login',
  ADMIN_LOGOUT: '/admins/auth/logout',
  ADMIN_CHANGE_PASSWORD: '/admins/auth/change-password',
  ADMIN_REFRESH_TOKEN: '/admins/auth/refresh-token',
  ADMIN_ME: '/admins/auth/me',
  
  // Admin Articles
  ADMIN_ARTICLES: '/admins/articles',
  ADMIN_ARTICLE_BY_ID: (id: string) => `/admins/articles/${id}`,
  
  // Admin Admins (Admin Management)
  ADMIN_ADMINS: '/admins/admins',
  ADMIN_ADMIN_BY_ID: (id: string) => `/admins/admins/${id}`,
  
  // Admin Users (Client/Doula Management)
  ADMIN_USERS: '/admins/users',
  ADMIN_USER_BY_ID: (id: string) => `/admins/users/${id}`,
  
  ADMIN_CATEGORIES: '/admins/categories',
  ADMIN_CATEGORY_BY_ID: (id: string) => `/admins/categories/${id}`,
  
  ADMIN_DOULAS: '/admins/doulas',
  ADMIN_DOULA_BY_ID: (id: string) => `/admins/doulas/${id}`,
  ADMIN_DOULA_SUBSCRIPTIONS: '/admins/doula-subscriptions',
  ADMIN_DOULA_PACKAGES: '/admins/doula-packages',
  ADMIN_DOULA_VOUCHERS: '/admins/doula-vouchers',
  
  ADMIN_VOUCHERS: '/admins/vouchers',
  ADMIN_VOUCHER_BY_ID: (id: string) => `/admins/vouchers/${id}`,
  
  ADMIN_REVIEWS: '/admins/reviews',
  ADMIN_REVIEW_BY_ID: (id: string) => `/admins/reviews/${id}`,
  
  ADMIN_SUBSCRIPTIONS: '/admins/subscriptions',
  ADMIN_SUBSCRIPTION_BY_ID: (id: string) => `/admins/subscriptions/${id}`,
  
  ADMIN_SETTINGS: '/admins/settings',
  ADMIN_SETTING_BY_ID: (id: string) => `/admins/settings/${id}`,
  
  ADMIN_HELP_DOCUMENTS: '/admins/help-documents',
  ADMIN_HELP_DOCUMENT_BY_ID: (id: string) => `/admins/help-documents/${id}`,
  
  ADMIN_PD_SESSIONS: '/admins/pd-sessions',
  ADMIN_PD_SESSION_BY_ID: (id: string) => `/admins/pd-sessions/${id}`,
  
  ADMIN_SEARCH_SETTINGS: '/admins/search-settings',
  ADMIN_SEARCH_SETTING_BY_ID: (id: string) => `/admins/search-settings/${id}`,
  
  // Admin Trending Keywords (Search Settings)
  ADMIN_TRENDING_KEYWORDS: '/admins/trending-keywords',
  ADMIN_TRENDING_KEYWORD_BY_ID: (id: string) => `/admins/trending-keywords/${id}`,
  
  // Admin Billing/Transactions
  ADMIN_BILLING_HISTORY: '/admins/billing-history',
  ADMIN_TRANSACTIONS: '/admins/transactions',
  
  // Media Upload
  MEDIA_SIGNED_URL: '/medias/signed-url',
  
  // Public Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_SSO_LOGIN: '/auth/login-by-sso-token',
  AUTH_CHECK_SSO: '/auth/check-exists-sso',
  
  // Public Articles
  ARTICLES: '/articles',
  ARTICLE_BY_SLUG: (slug: string) => `/articles/${slug}`,
  ARTICLE_BY_ID: (id: string) => `/articles/by-id/${id}`,
  ARTICLE_FAVORITE: (id: string) => `/articles/favorite/${id}`,
}
