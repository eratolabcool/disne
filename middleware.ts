import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * [INPUT]: 依赖 next-intl/middleware 和 Next.js 的 NextRequest/NextResponse
 * [OUTPUT]: 对外提供 i18n 中间件和安全过滤
 * [POS]: 应用的第一道防线，拦截恶意请求和 i18n 路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ============================================================================
// 安全配置：阻断路径黑名单
// ============================================================================
const BLOCKED_PATTERNS = [
  /\.php$/i,           // PHP 后门扫描
  /\.asp$/i,           // ASP 后门
  /\.jsp$/i,           // JSP 后门
  /\/wp-/,             // WordPress 扫描
  /\/wordpress/,       // WordPress 扫描
  /\/admin\//i,        // 管理面板扫描
  /\/shell\.php/i,     // Webshell
  /\/\.env/i,          // 环境变量窃取
  /\/\.git/i,          // Git 仓库泄露
  /\/config\.php/i,    // 配置文件
  /\.xml$/i,           // XMLRPC 扫描（WordPress）
];

/**
 * 检测请求路径是否匹配黑名单模式
 */
function isBlockedPath(pathname: string): boolean {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * 增强型中间件：安全过滤 + i18n 路由
 */
export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ======================== 第一道防线：路径黑名单 ========================
  if (isBlockedPath(pathname)) {
    // 立即返回 404，不执行任何后续逻辑
    return new NextResponse(null, { status: 404 });
  }

  // ======================== 第二道防线：i18n 路由 ========================
  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|zh|ja|es|de|pt)/:path*",
    // 明确排除：静态文件、API、Next.js 内部路径
    "/((?!api/|_next|_vercel|.*\\.(txt|ico|svg|png|jpg|jpeg|webp|gif|woff2?|ttf|eot|wasm|mp4|webm|mp3|pdf|zip|json|xml|webmanifest|js|css)$).*)",
  ],
};
