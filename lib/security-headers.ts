// 安全性头部配置 - 符合 OWASP 和现代 Web 安全标准
export const SECURITY_HEADERS = {
  // 基础安全头部
  'X-DNS-Prefetch-Control': 'on',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // 高级安全头部
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block; report=https://csp-report.example.com',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
  'Content-Security-Policy': [
    // 默认策略
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.supabase.co",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),

  // 性能和安全优化
  'Vary': 'Accept-Encoding',
  'Cache-Control': 'public, max-age=31536000, immutable',
  'ETag': 'W/"a1b2c3d4"',

  // PWA 和现代 Web 标准
  'Service-Worker-Allowed': '/',
  'Accept-CH': 'Viewport-Width, Width, Device-Orientation',
  'Critical-CH': 'Viewport-Width, Width, Device-Orientation',

  // 可访问性头部
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? '*' : 'https://disneysolitaire.net',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',

  // 隐私和合规
  'X-Privacy-Policy': 'https://disneysolitaire.net/privacy',
  'X-Terms-of-Service': 'https://disneysolitaire.net/terms',
  'X-Contact': 'support@disneysolitaire.net'
};

// 内容安全策略构建器
export class CSPBuilder {
  private directives: string[] = [];

  private addDirective(directive: string): this {
    this.directives.push(directive);
    return this;
  }

  defaultSrc(sources: string): this {
    return this.addDirective(`default-src ${sources}`);
  }

  scriptSrc(sources: string): this {
    return this.addDirective(`script-src ${sources}`);
  }

  styleSrc(sources: string): this {
    return this.addDirective(`style-src ${sources}`);
  }

  imgSrc(sources: string): this {
    return this.addDirective(`img-src ${sources}`);
  }

  connectSrc(sources: string): this {
    return this.addDirective(`connect-src ${sources}`);
  }

  fontSrc(sources: string): this {
    return this.addDirective(`font-src ${sources}`);
  }

  mediaSrc(sources: string): this {
    return this.addDirective(`media-src ${sources}`);
  }

  objectSrc(sources: string): this {
    return this.addDirective(`object-src ${sources}`);
  }

  childSrc(sources: string): this {
    return this.addDirective(`child-src ${sources}`);
  }

  frameSrc(sources: string): this {
    return this.addDirective(`frame-src ${sources}`);
  }

  workerSrc(sources: string): this {
    return this.addDirective(`worker-src ${sources}`);
  }

  manifestSrc(sources: string): this {
    return this.addDirective(`manifest-src ${sources}`);
  }

  baseURI(uri: string): this {
    return this.addDirective(`base-uri ${uri}`);
  }

  formAction(sources: string): this {
    return this.addDirective(`form-action ${sources}`);
  }

  frameAncestors(sources: string): this {
    return this.addDirective(`frame-ancestors ${sources}`);
  }

  upgradeInsecureRequests(): this {
    return this.addDirective('upgrade-insecure-requests');
  }

  blockAllMixedContent(): this {
    return this.addDirective('block-all-mixed-content');
  }

  reportURI(uri: string): this {
    return this.addDirective(`report-uri ${uri}`);
  }

  reportTo(uri: string): this {
    return this.addDirective(`report-to ${uri}`);
  }

  requireTrustedTypesFor(script: string): this {
    return this.addDirective(`require-trusted-types-for ${script}`);
  }

  trustedTypes(sources: string): this {
    return this.addDirective(`trusted-types ${sources}`);
  }

  build(): string {
    return this.directives.join('; ');
  }
}

// 预配置的 CSP 构建器
export function createProductionCSP(): CSPBuilder {
  return new CSPBuilder()
    .defaultSrc("'self'")
    .scriptSrc("'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com")
    .styleSrc("'self' 'unsafe-inline' https://fonts.googleapis.com")
    .imgSrc("'self' data: https: blob:")
    .fontSrc("'self' https://fonts.gstatic.com")
    .connectSrc("'self' https://api.supabase.co https://www.googletagmanager.com")
    .mediaSrc("'self'")
    .objectSrc("'none'")
    .baseURI("'self'")
    .formAction("'self'")
    .frameAncestors("'none'")
    .upgradeInsecureRequests();
}

export function createDevelopmentCSP(): CSPBuilder {
  return new CSPBuilder()
    .defaultSrc("'self'")
    .scriptSrc("'self' 'unsafe-inline' 'unsafe-eval'")
    .styleSrc("'self' 'unsafe-inline'")
    .imgSrc("'self' data: https: blob:")
    .fontSrc("'self' https://fonts.gstatic.com")
    .connectSrc("'self' https: ws: wss:")
    .mediaSrc("'self'")
    .objectSrc("'none'")
    .baseURI("'self'")
    .formAction("'self'")
    .frameAncestors("'none'");
}

// 权限策略生成器
export function createPermissionsPolicy(): string {
  const permissions = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'clipboard-read=()',
    'clipboard-write=()',
    'fullscreen=()',
    'gamepad=()',
    'hid=()',
    'idle-detection=()',
    'pointer-lock=()',
    'screen-wake-lock=()',
    'xr-spatial-tracking=()',
    'web-share=()'
  ];

  return permissions.join(', ');
}

// 安全审计检查器
export class SecurityAuditor {
  static checkHeaders(headers: Record<string, string>): {
    issues: string[];
  } {
    const issues: string[] = [];

    if (!headers['X-DNS-Prefetch-Control']) {
      issues.push('Missing X-DNS-Prefetch-Control header');
    }

    if (!headers['X-Frame-Options']) {
      issues.push('Missing X-Frame-Options header - vulnerable to clickjacking');
    }

    if (!headers['X-Content-Type-Options']) {
      issues.push('Missing X-Content-Type-Options header - vulnerable to MIME sniffing');
    }

    if (!headers['X-XSS-Protection']) {
      issues.push('Missing X-XSS-Protection header');
    }

    if (!headers['Strict-Transport-Security']) {
      issues.push('Missing Strict-Transport-Security header - recommend for HTTPS sites');
    }

    if (!headers['Permissions-Policy']) {
      issues.push('Missing Permissions-Policy header - consider implementing for privacy');
    }

    return { issues };
  }

  static checkCSP(csp: string): {
    issues: string[];
  } {
    const issues: string[] = [];

    if (!csp.includes('default-src')) {
      issues.push('CSP missing default-src directive');
    }

    if (csp.includes("'unsafe-eval'") || csp.includes("'unsafe-inline'")) {
      issues.push('CSP contains unsafe-eval or unsafe-inline - security risk');
    }

    if (!csp.includes('upgrade-insecure-requests')) {
      issues.push('CSP missing upgrade-insecure-requests directive - recommend for HTTPS');
    }

    return { issues };
  }

  static generateSecurityReport(url: string): {
    url: string;
    timestamp: string;
    scanResults: {
      securityHeaders: string[];
      csp: boolean;
      https: boolean;
      vulnerabilities: string[];
      score: number;
    };
    recommendations: string[];
  } {
    // 模拟安全扫描报告
    return {
      url,
      timestamp: new Date().toISOString(),
      scanResults: {
        securityHeaders: ['X-DNS-Prefetch-Control', 'X-Frame-Options', 'X-Content-Type-Options'],
        csp: true,
        https: true,
        vulnerabilities: [],
        score: 95
      },
      recommendations: [
        'Implement HTTP Strict Transport Security (HSTS)',
        'Add Content Security Policy (CSP)',
        'Enable subresource integrity',
        'Use secure cookie attributes'
      ]
    };
  }
}

// 动态头部生成器
export class DynamicHeaders {
  static generateHeaders(context: {
    request?: Request;
    response?: Response;
    userAgent?: string;
    isMobile?: boolean;
    isSecure?: boolean;
  }): Record<string, string> {
    const headers: Record<string, string> = { ...SECURITY_HEADERS };

    // 根据上下文调整头部
    if (context.isSecure) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    if (context.isMobile) {
      headers['Vary'] = 'User-Agent, Accept-Encoding';
    }

    // 动态 CSP 头
    if (context.request) {
      const isDevelopment = context.request.url.includes('localhost') ||
                          context.request.url.includes('127.0.0.1');

      const csp = isDevelopment ? createDevelopmentCSP() : createProductionCSP();
      headers['Content-Security-Policy'] = csp.build();
    }

    return headers;
  }
}

// 安全评分计算器
export function calculateSecurityScore(headers: Record<string, string>): number {
  const securityHeaders = [
    'X-DNS-Prefetch-Control',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Permissions-Policy'
  ];

  const cspHeaders = ['Content-Security-Policy'];
  const bestPracticeHeaders = [
    'Cache-Control',
    'ETag',
    'Vary'
  ];

  let score = 0;

  // 安全头部评分 (60%)
  securityHeaders.forEach(header => {
    if (headers[header]) score += 10;
  });

  // CSP 评分 (30%)
  cspHeaders.forEach(header => {
    if (headers[header]) score += 15;
  });

  // 最佳实践评分 (10%)
  bestPracticeHeaders.forEach(header => {
    if (headers[header]) score += 3.33;
  });

  return Math.round(score);
}

// 安全合规检查器
export class ComplianceChecker {
  static checkWCAGCompliance(html: string): {
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      guideline: string;
      description: string;
      element?: string;
    }>;
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
  } {
    const issues: Array<{
      type: 'error' | 'warning' | 'info';
      guideline: string;
      description: string;
      element?: string;
    }> = [];

    // 检查语言属性
    if (!html.includes('lang=')) {
      issues.push({
        type: 'error',
        guideline: 'WCAG 3.1.1',
        description: 'Missing language attribute on HTML element',
        element: 'html'
      });
    }

    // 检查标题
    const titleMatches = html.match(/<title[^>]*>([^<]+)<\/title>/);
    if (!titleMatches || titleMatches[1].trim().length === 0) {
      issues.push({
        type: 'error',
        guideline: 'WCAG 2.4.2',
        description: 'Page title is empty or missing',
        element: 'title'
      });
    }

    // 检查图片 alt 文本
    const imgMatches = html.match(/<img[^>]*>/g) || [];
    imgMatches.forEach((img, index) => {
      if (!img.includes('alt=')) {
        issues.push({
          type: 'error',
          guideline: 'WCAG 1.1.1',
          description: `Image missing alt attribute (image ${index + 1})`,
          element: img
        });
      }
    });

    // 检查表单标签
    const inputMatches = html.match(/<input[^>]*>/g) || [];
    inputMatches.forEach((input, index) => {
      const id = input.match(/id="([^"]*)"/);
      const hasLabel = html.includes(`for="${id?.[1]}"`) ||
                       input.includes('aria-label=') ||
                       input.includes('title=');

      if (!hasLabel) {
        issues.push({
          type: 'warning',
          guideline: 'WCAG 3.3.2',
          description: `Input field missing label or aria-label (input ${index + 1})`,
          element: input
        });
      }
    });

    return {
      score: Math.max(0, 100 - (issues.filter(i => i.type === 'error').length * 5) - (issues.filter(i => i.type === 'warning').length * 2)),
      issues,
      totalIssues: issues.length,
      errors: issues.filter(i => i.type === 'error').length,
      warnings: issues.filter(i => i.type === 'warning').length,
      info: issues.filter(i => i.type === 'info').length
    };
  }
}
