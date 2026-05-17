export const apiDocs = {
  source: {
    productRepository: 'StellarTrail',
    inspectedHead: 'd5d2465',
    inspectedAt: '2026-05-17'
  },
  authentication: {
    required: false,
    noteKey: 'pathOnly'
  },
  endpoints: [
    {
      method: 'GET',
      path: '/healthz',
      summaryKey: 'health',
      response: {
        status: 200,
        body: { status: 'ok' }
      }
    },
    {
      method: 'GET',
      path: '/api/meta',
      summaryKey: 'meta',
      response: {
        status: 200,
        body: {
          name: 'StellarTrail',
          env: 'string',
          database_kind: 'string'
        }
      }
    }
  ],
  errors: [
    {
      status: 404,
      body: { code: 'not_found', message: 'resource not found' }
    }
  ]
} as const;

export type ApiDocEndpoint = (typeof apiDocs.endpoints)[number];
export type ApiDocEndpointSummaryKey = ApiDocEndpoint['summaryKey'];
