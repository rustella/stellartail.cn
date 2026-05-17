export type ApiDocAuth = 'public' | 'bearer' | 'admin';
export type ApiDocGroupKey = 'system' | 'auth' | 'content' | 'skills' | 'admin' | 'gear' | 'uploads' | 'feedback';

export interface ApiDocEndpointDefinition {
  id: string;
  groupKey: ApiDocGroupKey;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  auth: ApiDocAuth;
  status: number;
  requestBody?: unknown;
  query?: readonly string[];
  headers?: readonly string[];
  contentType?: string;
  responseType?: string;
  responseBody?: unknown;
}

export interface ApiDocErrorDefinition {
  status: number;
  body: Record<string, unknown>;
}

const loginResponse = {
  access_token: '<access_token>',
  expires_at: '2026-05-18T12:00:00Z',
  refresh_token: '<refresh_token>',
  refresh_expires_at: '2026-06-17T12:00:00Z',
  user: {
    id: 'user-id',
    username: 'trail_user',
    email: 'user@example.com',
    nickname: null,
    avatar_url: null
  }
};

const emailCodeResponse = {
  email: 'user@example.com',
  expires_at: '2026-05-18T12:10:00Z',
  debug_code: 'local-only'
};

const createGearRequest = {
  category: 'electronics_system',
  name: 'NITECORE SUMMIT 20000',
  brand: 'NITECORE',
  model: 'SUMMIT 20000',
  status: 'available',
  storage_location: 'gear shelf',
  tags: ['winter', 'power'],
  share_enabled: false,
  notes: 'Charge before storage'
};

const gearItemResponse = {
  id: 'gear-id',
  user_id: 'user-id',
  category: 'electronics_system',
  name: 'NITECORE SUMMIT 20000',
  brand: 'NITECORE',
  model: 'SUMMIT 20000',
  status: 'available',
  share_enabled: false,
  share_status: 'not_shared',
  tags: ['winter', 'power'],
  created_at: '2026-05-18T12:00:00Z',
  updated_at: '2026-05-18T12:00:00Z'
};

const uploadImageResponse = {
  id: 'upload-id',
  purpose: 'feedback_image',
  original_filename: 'photo.jpg',
  image_type: 'jpeg',
  content_type: 'image/jpeg',
  size_bytes: 123456,
  sha256: '<sha256>',
  download_url: '/api/me/uploads/upload-id',
  created_at: '2026-05-18T12:00:00Z'
};

export const apiDocs = {
  source: {
    productRepository: 'StellarTrail',
    inspectedHead: 'bd9cbb7',
    inspectedAt: '2026-05-18'
  },
  endpointCount: 31,
  groups: [
    { key: 'system', endpointIds: ['healthz', 'meta'] },
    {
      key: 'auth',
      endpointIds: [
        'authWechatLogin',
        'authEmailVerificationCode',
        'authEmailLoginCode',
        'authEmailLogin',
        'authPasswordResetCode',
        'authPasswordReset',
        'authRegister',
        'authPasswordLogin',
        'authRefresh',
        'authCaptcha'
      ]
    },
    { key: 'content', endpointIds: ['gearTemplatesList', 'gearTemplatesDetail'] },
    { key: 'skills', endpointIds: ['skillsCategories', 'skillsKnotsList', 'skillsKnotsDetail'] },
    { key: 'admin', endpointIds: ['adminKnotMediaUpload'] },
    {
      key: 'gear',
      endpointIds: [
        'gearsCategories',
        'gearsStats',
        'gearsExport',
        'gearsImport',
        'gearsList',
        'gearsCreate',
        'gearsDetail',
        'gearsUpdate',
        'gearsArchive',
        'gearsRestore'
      ]
    },
    { key: 'uploads', endpointIds: ['uploadsCreate', 'uploadsDownload'] },
    { key: 'feedback', endpointIds: ['feedbackCreate'] }
  ],
  endpoints: [
    {
      id: 'healthz',
      groupKey: 'system',
      method: 'GET',
      path: '/healthz',
      auth: 'public',
      status: 200,
      responseBody: { status: 'ok' }
    },
    {
      id: 'meta',
      groupKey: 'system',
      method: 'GET',
      path: '/api/meta',
      auth: 'public',
      status: 200,
      responseBody: { name: 'StellarTrail', env: 'string', database_kind: 'sqlite | postgres | mysql' }
    },
    {
      id: 'authWechatLogin',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/wechat-login',
      auth: 'public',
      status: 200,
      requestBody: { code: '<wx.login code>', profile: { nickname: 'trail user', avatar_url: null } },
      responseBody: loginResponse
    },
    {
      id: 'authEmailVerificationCode',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/email-verification-code',
      auth: 'public',
      status: 200,
      requestBody: { email: 'user@example.com' },
      responseBody: emailCodeResponse
    },
    {
      id: 'authEmailLoginCode',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/email-login-code',
      auth: 'public',
      status: 200,
      requestBody: { email: 'user@example.com' },
      responseBody: emailCodeResponse
    },
    {
      id: 'authEmailLogin',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/email-login',
      auth: 'public',
      status: 200,
      requestBody: { email: 'user@example.com', email_verification_code: '<email code>' },
      responseBody: loginResponse
    },
    {
      id: 'authPasswordResetCode',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/password-reset-code',
      auth: 'public',
      status: 200,
      requestBody: { email: 'user@example.com' },
      responseBody: emailCodeResponse
    },
    {
      id: 'authPasswordReset',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/password-reset',
      auth: 'public',
      status: 200,
      requestBody: { email: 'user@example.com', email_verification_code: '<email code>', password: '<new password>', confirm_password: '<new password>' },
      responseBody: loginResponse
    },
    {
      id: 'authRegister',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/register',
      auth: 'public',
      status: 200,
      requestBody: { username: 'trail_user', email: 'user@example.com', password: '<password>', confirm_password: '<password>', email_verification_code: '<email code>' },
      responseBody: loginResponse
    },
    {
      id: 'authPasswordLogin',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/login',
      auth: 'public',
      status: 200,
      requestBody: { account: 'trail_user', password: '<password>', captcha_ticket: '<captcha ticket>', captcha_answer: '<captcha answer>' },
      responseBody: loginResponse
    },
    {
      id: 'authRefresh',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/refresh',
      auth: 'public',
      status: 200,
      requestBody: { refresh_token: '<refresh_token>' },
      responseBody: loginResponse
    },
    {
      id: 'authCaptcha',
      groupKey: 'auth',
      method: 'POST',
      path: '/api/auth/captcha',
      auth: 'public',
      status: 200,
      requestBody: { account: 'trail_user' },
      responseBody: { captcha_ticket: '<captcha ticket>', captcha_type: 'image', image_svg: '<svg>...</svg>', expires_at: '2026-05-18T12:05:00Z', debug_answer: 'local-only' }
    },
    {
      id: 'gearTemplatesList',
      groupKey: 'content',
      method: 'GET',
      path: '/api/gear-templates',
      auth: 'public',
      status: 200,
      responseBody: { items: [{ id: 'backpacking-basic', title: 'starter backpacking gear template', categories: [{ id: 'lighting', name: 'lighting', items: ['headlamp'] }] }] }
    },
    {
      id: 'gearTemplatesDetail',
      groupKey: 'content',
      method: 'GET',
      path: '/api/gear-templates/:id',
      auth: 'public',
      status: 200,
      responseBody: { id: 'backpacking-basic', title: 'starter backpacking gear template', categories: [{ id: 'lighting', name: 'lighting', items: ['headlamp'] }] }
    },
    {
      id: 'skillsCategories',
      groupKey: 'skills',
      method: 'GET',
      path: '/api/skills',
      auth: 'public',
      status: 200,
      headers: ['X-StellarTrail-Locale: zh-CN | en', 'Accept-Language: zh-CN, en'],
      responseBody: { items: [{ id: 'knots', slug: 'knots', title: 'Knots', summary: 'Practical knot skills', item_count: 225, href: '/skills/knots' }] }
    },
    {
      id: 'skillsKnotsList',
      groupKey: 'skills',
      method: 'GET',
      path: '/api/skills/knots/list',
      auth: 'public',
      status: 200,
      query: ['offset', 'limit', 'category', 'q'],
      headers: ['X-StellarTrail-Locale: zh-CN | en', 'If-None-Match: <etag>'],
      responseBody: { locale: 'zh-CN', items: [{ id: 'adjustable-grip-hitch-knot', slug: 'adjustable-grip-hitch-knot', title: 'Adjustable grip hitch', summary: 'Adjustable guyline knot', difficulty: null, categories: [], types: [], media: [], href: '/skills/knots/adjustable-grip-hitch-knot' }], page: { limit: 20, offset: 0, next_offset: 20 } }
    },
    {
      id: 'skillsKnotsDetail',
      groupKey: 'skills',
      method: 'GET',
      path: '/api/skills/knots/detail/:id',
      auth: 'public',
      status: 200,
      headers: ['X-StellarTrail-Locale: zh-CN | en', 'If-None-Match: <etag>'],
      responseBody: { id: 'adjustable-grip-hitch-knot', slug: 'adjustable-grip-hitch-knot', title: 'Adjustable grip hitch', summary: 'Adjustable guyline knot', description: 'string', steps: ['step text'], difficulty: null, categories: [], types: [], media: [], locale: 'zh-CN' }
    },
    {
      id: 'adminKnotMediaUpload',
      groupKey: 'admin',
      method: 'PUT',
      path: '/api/admin/skills/knots/:knot_id/media/:asset_id',
      auth: 'admin',
      status: 201,
      contentType: 'multipart/form-data',
      requestBody: { file: '<binary>', media_type: 'thumbnail | preview | draw_gif | turntable_gif | draw_mp4 | turntable_mp4', attribution: 'Knots 3D', license_note: 'license note', source_name: 'source name', source_path: 'source path' },
      responseBody: { status: 'uploaded', knot_id: 'adjustable-grip-hitch-knot', media: { id: 'draw_gif', media_type: 'draw_gif', url: '<public media URL>', mime_type: 'image/gif', width: null, height: null, size_bytes: 123456, attribution: 'Knots 3D', license_note: 'license note' } }
    },
    {
      id: 'gearsCategories',
      groupKey: 'gear',
      method: 'GET',
      path: '/api/me/gears/categories',
      auth: 'bearer',
      status: 200,
      query: ['tab'],
      responseBody: { items: [{ id: 'all', label: 'All gear', count: 12 }, { id: 'electronics_system', label: 'Electronics', count: 3 }] }
    },
    {
      id: 'gearsStats',
      groupKey: 'gear',
      method: 'GET',
      path: '/api/me/gears/stats',
      auth: 'bearer',
      status: 200,
      query: ['tab'],
      responseBody: { current_count: 10, archived_count: 2, total_value_cents: 123400, total_weight_g: 4567, by_category: [], by_status: [] }
    },
    {
      id: 'gearsExport',
      groupKey: 'gear',
      method: 'GET',
      path: '/api/me/gears/export',
      auth: 'bearer',
      status: 200,
      query: ['tab', 'format=csv'],
      responseType: 'text/csv; charset=utf-8',
      responseBody: 'CSV file: text/csv; charset=utf-8'
    },
    {
      id: 'gearsImport',
      groupKey: 'gear',
      method: 'POST',
      path: '/api/me/gears/import',
      auth: 'bearer',
      status: 200,
      requestBody: { dry_run: true, items: [createGearRequest] },
      responseBody: { created_count: 0, updated_count: 0, failed_count: 0, errors: [] }
    },
    {
      id: 'gearsList',
      groupKey: 'gear',
      method: 'GET',
      path: '/api/me/gears',
      auth: 'bearer',
      status: 200,
      query: ['tab', 'category', 'status', 'q', 'sort', 'limit', 'cursor'],
      responseBody: { items: [{ id: 'gear-id', category: 'electronics_system', category_label: 'Electronics', name: 'NITECORE SUMMIT 20000', status: 'available', status_label: 'Available', created_at: '2026-05-18T12:00:00Z', updated_at: '2026-05-18T12:00:00Z' }], next_cursor: null }
    },
    {
      id: 'gearsCreate',
      groupKey: 'gear',
      method: 'POST',
      path: '/api/me/gears',
      auth: 'bearer',
      status: 201,
      requestBody: createGearRequest,
      responseBody: gearItemResponse
    },
    {
      id: 'gearsDetail',
      groupKey: 'gear',
      method: 'GET',
      path: '/api/me/gears/:id',
      auth: 'bearer',
      status: 200,
      responseBody: gearItemResponse
    },
    {
      id: 'gearsUpdate',
      groupKey: 'gear',
      method: 'PATCH',
      path: '/api/me/gears/:id',
      auth: 'bearer',
      status: 200,
      requestBody: { status: 'maintenance', notes: 'replace battery' },
      responseBody: { ...gearItemResponse, status: 'maintenance', notes: 'replace battery' }
    },
    {
      id: 'gearsArchive',
      groupKey: 'gear',
      method: 'DELETE',
      path: '/api/me/gears/:id',
      auth: 'bearer',
      status: 204
    },
    {
      id: 'gearsRestore',
      groupKey: 'gear',
      method: 'POST',
      path: '/api/me/gears/:id/restore',
      auth: 'bearer',
      status: 200,
      responseBody: gearItemResponse
    },
    {
      id: 'uploadsCreate',
      groupKey: 'uploads',
      method: 'POST',
      path: '/api/me/uploads',
      auth: 'bearer',
      status: 201,
      contentType: 'multipart/form-data',
      requestBody: { file: '<binary image>' },
      responseBody: uploadImageResponse
    },
    {
      id: 'uploadsDownload',
      groupKey: 'uploads',
      method: 'GET',
      path: '/api/me/uploads/:id',
      auth: 'bearer',
      status: 200,
      responseType: 'image/*',
      responseBody: 'Binary image stream with Content-Disposition inline and X-Content-Type-Options: nosniff'
    },
    {
      id: 'feedbackCreate',
      groupKey: 'feedback',
      method: 'POST',
      path: '/api/me/feedback',
      auth: 'bearer',
      status: 201,
      requestBody: { category: 'bug | suggestion | content_correction | other', content: 'feedback text', contact: 'user@example.com', page: '/gear', client_platform: 'web', client_version: '1.0.0', device_model: 'browser', image_ids: ['upload-id'] },
      responseBody: { id: 'feedback-id', category: 'bug', content: 'feedback text', contact: 'user@example.com', page: '/gear', client_platform: 'web', client_version: '1.0.0', device_model: 'browser', status: 'open', images: [uploadImageResponse], created_at: '2026-05-18T12:00:00Z', updated_at: '2026-05-18T12:00:00Z' }
    }
  ] satisfies readonly ApiDocEndpointDefinition[],
  commonHeaders: {
    bearer: 'Authorization: Bearer <access_token>',
    locale: 'X-StellarTrail-Locale: zh-CN | en'
  },
  errors: [
    { status: 400, body: { code: 'bad_request', message: 'request is invalid' } },
    { status: 400, body: { code: 'unsupported_query_parameter', message: 'query parameter `locale` is not supported', parameter: 'locale' } },
    { status: 400, body: { code: 'invalid_header', message: 'header `X-StellarTrail-Locale` is invalid', parameter: 'X-StellarTrail-Locale' } },
    { status: 400, body: { code: 'invalid_query_parameter', message: 'query parameter is invalid', parameter: 'limit' } },
    { status: 401, body: { code: 'unauthorized', message: 'missing or invalid bearer token' } },
    { status: 401, body: { code: 'invalid_credentials', message: 'username/email or password is invalid' } },
    { status: 403, body: { code: 'forbidden', message: 'administrator permission is required' } },
    { status: 404, body: { code: 'not_found', message: 'resource not found' } },
    { status: 413, body: { code: 'payload_too_large', message: 'file must be at most <max_bytes> bytes' } },
    { status: 415, body: { code: 'unsupported_media_type', message: 'file type is not supported' } },
    { status: 422, body: { code: 'validation_failed', message: 'request validation failed', fields: [{ field: 'name', message: 'is required' }] } },
    { status: 428, body: { code: 'captcha_required', message: 'captcha is required', captcha: { type: 'image', endpoint: '/api/auth/captcha' } } },
    { status: 429, body: { code: 'rate_limited', message: 'Too many requests. Please retry after <seconds> seconds.' } },
    { status: 502, body: { code: 'email_delivery_failed', message: 'email verification code delivery failed' } },
    { status: 500, body: { code: 'internal_error', message: 'internal server error' } }
  ] satisfies readonly ApiDocErrorDefinition[]
} as const;

export type ApiDocEndpoint = (typeof apiDocs.endpoints)[number];
export type ApiDocEndpointId = ApiDocEndpoint['id'];
export type ApiDocEndpointGroupKey = (typeof apiDocs.groups)[number]['key'];
