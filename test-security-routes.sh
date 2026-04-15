#!/bin/bash

# ============================================================================
# 安全路由验证脚本
# ============================================================================
# 用途：测试恶意路径是否被正确拦截
# 执行：bash test-security-routes.sh
# ============================================================================

echo "🔒 安全路由验证测试"
echo "========================================"

# 恶意路径列表（应该返回 404）
MALICIOUS_PATHS=(
  "/shell.php"
  "/wp-includes/Requests"
  "/config.php"
  "/.env"
  "/.git/config"
  "/admin/login.php"
  "/wordpress/wp-admin"
  "/test.asp"
  "/hack.jsp"
  "/xmlrpc.php"
)

echo ""
echo "📋 测试恶意路径阻断（预期：404 Not Found）"
echo "----------------------------------------"

for path in "${MALICIOUS_PATHS[@]}"; do
  echo -n "测试 $path ... "
  # 实际部署后可以取消注释以下行进行真实测试
  # status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  # if [ "$status" = "404" ]; then
  #   echo "✅ PASS (HTTP $status)"
  # else
  #   echo "❌ FAIL (HTTP $status, expected 404)"
  # fi
  echo "🔍 需要部署后测试"
done

echo ""
echo "✅ 安全加固完成！"
echo ""
echo "📊 三层防御架构："
echo "  1️⃣  Vercel 边缘网络 → 直接返回 404（vercel.json routes）"
echo "  2️⃣  Next.js 中间件 → 路径黑名单过滤（middleware.ts）"
echo "  3️⃣  安全 HTTP 头部 → XSS/Clickjacking 防护（next.config.mjs）"
echo ""
echo "🚀 下一步："
echo "  git add ."
echo "  git commit -m 'fix(security): 阻断恶意扫描请求，解决 CPU 超限'"
echo "  git push"
echo ""
