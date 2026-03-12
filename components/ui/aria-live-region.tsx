'use client';

import React, { useState } from 'react';

interface AriaLiveRegionProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive' | 'off';
  'aria-label'?: string;
  className?: string;
}

/**
 * AriaLiveRegion 组件 - 提供屏幕阅读器实时更新通知
 * 符合 WCAG 2.1 AA 4.1.3 标准
 */
export function AriaLiveRegion({
  children,
  priority = 'polite',
  'aria-label': ariaLabel,
  className = ''
}: AriaLiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      aria-label={ariaLabel || 'Status updates'}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * useAriaLive Hook - 为组件提供实时通知功能
 */
export function useAriaLive() {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // 创建临时 live region
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // 3秒后移除
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 3000);

    // 更新本地状态
    setAnnouncements(prev => [...prev, message]);

    // 清理旧的公告
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);
  };

  return { announce, announcements };
}

/**
 * ScreenReaderText 组件 - 仅对屏幕阅读器可见的文本
 */
export function ScreenReaderText({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * useScreenReaderAnnouncement Hook - 通用的屏幕阅读器通知
 */
export function useScreenReaderAnnouncement() {
  const announce = (message: string) => {
    // 创建临时通知元素
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // 短暂延迟后移除
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  return { announce };
}
